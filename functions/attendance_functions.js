import { attendance } from "../db/schema/attendance";
import { eq } from "drizzle-orm";


export async function create_attendance_record(db, req) {
  try {
    const { event_id, user_id } = await req.json();
    await db.insert(attendance).values({
      event_id,
      user_id,
      checked_in: false 
    });
    return "Attendance record created.";
  } catch (error) {
    console.error("Error creating attendance:", error.message);
    return new Response("Error", { status: 500 });
  }
}


export async function mark_checked_in(db, req) {
  try {
    const { event_id, user_id } = await req.json();
    await db.update(attendance)
      .set({ checked_in: true, check_in_time: new Date() })
      .where(eq(attendance.event_id, event_id))
      .where(eq(attendance.user_id, user_id));
    return "User checked in.";
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
