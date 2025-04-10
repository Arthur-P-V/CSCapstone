import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { events } from "./db/schema/events";
import { eq, ne, gt, gte} from "drizzle-orm";

import {create_event, delete_event, get_all_events, get_event_by_id} from "./functions/event_functions";
import { get_all_users, get_user_by_eNumber, delete_user, create_user } from "./functions/user_functions";

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
      // Different routes, currently have users and events
      // Loads all the users or create a new user
      "/api/users": {
        GET: async () => {
          const data = await get_all_users(db);
          return Response.json(data);
        },
        POST: async (req) => {
          const data = await create_user(db, req);
          return Response.json(data);
      }
      },
      // Searches up by enumber
      "/api/users/:eNumber":{
        // Get user by eNumber
        GET: async req => {
          const data = await get_user_by_eNumber(db, req);
          return Response.json(data);
       },
       // Delete user by eNumber
       DELETE: async req => {
           const data = await delete_user(db, req);
           return Response.json(data);
       },
       // IDK right now
       PUT: async req => {
           return new Response("UPDATE UPDATE");
       }
      },
      // Loads all the events or create a new event

        "/api/events": {
            GET: async () => {
                const data = await get_all_events(db);
                return Response.json(data);
            },
            POST: async (req) => {
                const data = await create_event(db, req)
                //const {name, location, current_qr, description, type} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter
                //const new_event = await db.insert(events).values({event_name: name, location: location, current_qr: current_qr, description: description, type: type});
                //console.log(name);
                return Response.json(data);
            }
        },

        // Searches up by id

        "/api/events/:id": {
            GET: async req => {
               const data = await get_event_by_id(db, req);
               return Response.json(data);
            },
            DELETE: async req => {
                const data = await delete_event(db, req);
                return Response.json(data);
            },
            PUT: async req => {
                return new Response("UPDATE UPDATE");
            }
        }
    },

    port: 3000,
    fetch(req) {
        return new Response("Not Found", {status:404 });
    },
});

console.log(`Listening on http://localhost:${server.port}`)