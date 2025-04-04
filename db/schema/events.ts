import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { types } from "./types";

export const events = table(
    "events",
    {
        id: t.int().notNull().primaryKey().autoincrement(),
        date_created: t.timestamp().defaultNow(),
        event_name: t.varchar({length: 50}).notNull(),
        location: t.varchar({length: 256}).notNull(),
        meeting_time: t.datetime(),
        current_qr: t.varchar({length: 500}),
        description: t.varchar({length: 500}).notNull(),
        type: t.int().references((): AnyMySqlColumn => types.id),
        roster_file: t.varchar({length: 1000})
    }
)