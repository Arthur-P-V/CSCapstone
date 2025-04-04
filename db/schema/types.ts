import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";


export const types = table(
    "types",
    {
        id: t.int().notNull().primaryKey().autoincrement(),
        name: t.varchar({length: 20}).notNull(),
    }
)