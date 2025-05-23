import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { classes } from "./classes"

export const meetings = table(
    "meetings",
    {
        id: t.int().notNull().primaryKey().autoincrement(),
        class_id: t.int().notNull().references((): AnyMySqlColumn => classes.id),
        location: t.varchar({length: 30}).notNull(),
        date: t.datetime(), //Will eventually be notnull when I figure out how to pass it lmao
        qrcode: t.varchar({length: 100}), // This should probably just be set in the backend in general
        cancelled: t.boolean().default(false),
    }
)