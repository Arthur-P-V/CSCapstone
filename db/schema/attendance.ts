import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import { users } from "./users";
import { events } from "./events";

export const attendance = table("attendance_record", {
  event_id: t.int().notNull().references(() => events.id),
  user_id: t.int().notNull().references(() => users.id),
  checked_in: t.boolean().notNull().default(false),
  check_in_time: t.datetime() 
});
