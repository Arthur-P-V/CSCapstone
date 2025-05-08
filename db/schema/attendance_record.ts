import { int, primaryKey, mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { users } from "./users"
import { meetings } from "./meetings"


export const attendance_record = table(
    "attendance_record",
    {
        eNumber: t.int().notNull().references((): AnyMySqlColumn => users.eNumber),
        meeting_id: t.int().notNull().references((): AnyMySqlColumn => meetings.id),
        check_in_time: t.date(),
    },(table) => [
  primaryKey({name: 'attendance', columns: [table.eNumber, table.meeting_id] })]
)