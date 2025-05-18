import { attendance_record } from "../db/schema/attendance_record";
import { users } from "../db/schema/users";
import { classes } from "../db/schema/classes";
import { meetings } from "../db/schema/meetings";
import { eq, and } from "drizzle-orm";
import { sql} from "drizzle-orm"



export async function create_attendance_record(db, req) {
  try {
    const { eNumber, meeting_id } = await req.json();
    await db.insert(attendance_record).values({
      eNumber,
      meeting_id
    });
    return "Attendance record created.";
  } catch (error) {
    console.error("Error creating attendance:", error.message);
    return new Response("Error", { status: 500 });
  }
}



export async function mark_checked_in(db, { eNumber, meeting_id}) {
  try {
    // The student record already exists in the attendance record
    const result = await db
    .select({ exists: sql`1`})
    .from(attendance_record)
    .where(
      and(
        eq(attendance_record.eNumber, eNumber),
        eq(attendance_record.meeting_id, meeting_id)
      )
    );
    const studentExists = result.length > 0;
    if(studentExists){
    await db.update(attendance_record)
      .set({ check_in_time: new Date() })
      .where(
        and(
          eq(attendance_record.eNumber, eNumber),
          eq(attendance_record.meeting_id, meeting_id)
        )
      ).limit(1);
    return "Check-in successful.";
    }
    else{
      const current_time = new Date();
      console.log(current_time);
      await db.insert(attendance_record).values({
        eNumber : eNumber,
        meeting_id: meeting_id,
        check_in_time : current_time
      });
      return ("Check-in successful.");
    }
  } catch (error) {
    console.error("Check-in failed:", error.message);
    return new Response("Error", { status: 500 });
  }
}



export async function get_all_attendance(db) {
  try {
    const data = await db
      .select({
        eNumber: users.eNumber,
        firstName: users.first_name,
        lastName: users.last_name,
        className: classes.name,
        checkInTime: attendance_record.check_in_time,
      })
      .from(attendance_record)
      .innerJoin(users, eq(users.eNumber, attendance_record.eNumber))
      .innerJoin(meetings, eq(meetings.id, attendance_record.meeting_id))
      .innerJoin(classes, eq(classes.id, meetings.class_id));

    return data;
  } catch (error) {
    console.error("Fetch attendance failed:", error.message);
    return [];
  }
}

export async function get_meeting_attendance(db, req) {
  try {

    const data = await db
      .select({
        eNumber: users.eNumber,
        firstName: users.first_name,
        lastName: users.last_name,
        className: classes.name,
        checkInTime: attendance_record.check_in_time,
      })
      .from(attendance_record)
      .innerJoin(users, eq(users.eNumber, attendance_record.eNumber))
      .innerJoin(meetings, eq(meetings.id, attendance_record.meeting_id))
      .innerJoin(classes, eq(classes.id, meetings.class_id))
      .where(eq(attendance_record.meeting_id, req.params.meeting_id));

    return data;
  } catch (error) {
    console.error("Fetch attendance failed:", error.message);
    return [];
  }
}

export async function get_user_attendance(db, PassedeNumber) {
  try {

    const data = await db
  .select({
    firstName: users.first_name,
    lastName: users.last_name,
    className: classes.name,
    description: classes.description,
    location: meetings.location,
    checkInTime: attendance_record.check_in_time,
  })
  .from(attendance_record)
  .innerJoin(meetings, eq(meetings.id, attendance_record.meeting_id))
  .innerJoin(classes, eq(classes.id, meetings.class_id))
  .innerJoin(users, eq(classes.teacher, users.id))
  .where(eq(attendance_record.eNumber, PassedeNumber));

    return data;
  } catch (error) {
    console.error("Fetch attendance failed:", error.message);
    return [];
  }
}



