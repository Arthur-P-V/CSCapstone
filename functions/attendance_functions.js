import { attendance_record } from "../db/schema/attendance_record";
import { users } from "../db/schema/users";
import { classes } from "../db/schema/classes";
import { meetings } from "../db/schema/meetings";
import { eq, and } from "drizzle-orm";


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
    await db.update(attendance_record)
      .set({ check_in_time: new Date() })
      .where(
        and(
          eq(attendance_record.eNumber, eNumber),
          eq(attendance_record.meeting_id, meeting_id)
        )
      );
    return "Check-in successful.";
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