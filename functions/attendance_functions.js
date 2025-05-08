import { attendance } from "../db/schema/attendance";
import { eq, and } from "drizzle-orm";


export async function create_attendance_record(db, req) {
  try {
    const { eNumber, meeting_id } = await req.json();
    await db.insert(attendance).values({
      eNumber,
      meeting_id
    });
    return "Attendance record created.";
  } catch (error) {
    console.error("Error creating attendance:", error.message);
    return new Response("Error", { status: 500 });
  }
}



export async function mark_checked_in(db, req) {
  try {
    const { eNumber, meeting_id } = await req.json();
    await db.update(attendance)
      .set({ check_in_time: new Date() })
      .where(
        and(
          eq(attendance.eNumber, eNumber),
          eq(attendance.meeting_id, meeting_id)
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
    const data = await db.select().from(attendance);
    return data;
  } catch (error) {
    console.error("Fetch attendance failed:", error.message);
    return [];
  }
}