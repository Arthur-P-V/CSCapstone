import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const users = table(
    "users",
    {
        id: t.int().notNull().primaryKey().autoincrement(),
        eNumber: t.varchar({length: 10}).notNull(),
        password_hash: t.varchar({length: 255}).notNull(),
        admin: t.int().notNull(),
        first_name: t.varchar({length: 20}).notNull(),
        last_name: t.varchar({length: 20}).notNull()
    }
)