import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";

import { getUsersData } from "./Functions";

const connection = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const db = drizzle({ client: connection });

const response = await db.select().from(users);

console.log("Hello via Bun!");

const server = Bun.serve({

  routes: {
    "/api/user": {
      
        GET: async req => {
          
          const data = await getUsersData(db);
    
          return Response.json(data);
      }
    },
    "/api/newUser": {
      // Want a nice front end to display text box to fill in information.
      POST: async req=>{
        // Not created yet
        createNewUser(db);
      }
    }
  },
  

    port: 3000,
    fetch(req) {
        return new Response("You are now on the EVIL BRANCH!");
    },
});

console.log(`Listening on http://localhost:${server.port}`)
