import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "mysql",
    dbCredentials: {
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    schema: "db/schema",
})