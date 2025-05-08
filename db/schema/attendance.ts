import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import { users } from "./users";
import { meetings } from "./meetings"; // ✅ Correct import now

export const attendance = table("attendance_record", {
  eNumber: t.varchar({ length: 10 }).notNull().references(() => users.eNumber),
  meeting_id: t.int().notNull().references(() => meetings.id), // ✅ Correct reference now
  check_in_time: t.datetime()
});
