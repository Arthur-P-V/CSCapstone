import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { events } from "./db/schema/events";
import { json } from "drizzle-orm/mysql-core";

const connection = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const db = drizzle({ client: connection });

const response = await db.select().from(events);

console.log("Hello via Bun!");

const server = Bun.serve({

    routes: {

        "/api/events": {
            GET: async () => {
                const data = await db.select().from(events)
                new Response(json(data))
            }
        }
    },

    port: 3000,
    fetch(req) {
        return new Response("You are now on the EVIL BRANCH!");
    },
});

console.log(`Listening on http://localhost:${server.port}`)