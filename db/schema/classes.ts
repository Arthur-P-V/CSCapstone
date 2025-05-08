import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { users } from "./users"

export const classes = table(
    "classes",
    {
        id: t.int().notNull().primaryKey().autoincrement(),
        date_created: t.timestamp().defaultNow(),
        teacher: t.int().references((): AnyMySqlColumn => users.id),
        name: t.varchar({length: 50}).notNull(),
        description: t.varchar({length: 500}).notNull(),
        recurring: t.boolean().notNull(),
        roster_file: t.varchar({length: 1000})
    }
)