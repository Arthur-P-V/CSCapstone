import { drizzle } from "drizzle-orm/mysql2"

const db = drizzle({ connection:{ uri: process.env.DATABASE_URL }});

const response = await db.select().from()

console.log("Hello via Bun!");

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("You are now on the EVIL BRANCH!");
    },
});

console.log(`Listening on http://localhost:${server.port}`)