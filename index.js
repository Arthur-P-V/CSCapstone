import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { classes } from "./db/schema/classes";
import { eq, ne, gt, gte} from "drizzle-orm";

import {create_class, delete_class, get_all_classes, get_class_by_id} from "./functions/class_functions";
import { get_all_users, get_user_by_eNumber, delete_user, create_user } from "./functions/user_functions";

import app from "./front_end/index.html"

const connection = await mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const db = drizzle({ client: connection });

const response = await db.select().from(classes);

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

        "/api/classes": {
            GET: async () => {
                const data = await get_all_classes(db);
                return Response.json(data);
            },
            POST: async (req) => {
                const data = await create_class(db, req)
                //const {name, location, current_qr, description, type} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter
                //const new_event = await db.insert(events).values({event_name: name, location: location, current_qr: current_qr, description: description, type: type});
                //console.log(name);
                return Response.json(data);
            }
        },

        // Searches up by id

        "/api/classes/:id": {
            GET: async req => {
               const data = await get_class_by_id(db, req);
               return Response.json(data);
            },
            DELETE: async req => {
                const data = await delete_class(db, req);
                return Response.json(data);
            },
            PUT: async req => {
                return new Response("UPDATE UPDATE");
            }
        },

        // The front end, this is using functions in the "front_end" folder and creating front end pages.
        // check-in is the default page
        "/check-in":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/index.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },
        "/styles.css": {
      GET: async (req) => {
        const file = Bun.file("front_end/styles.css");
    if (!(await file.exists())) {
      return new Response("CSS file not found", { status: 404 });
    }
        
        return new Response(file, {
          headers: {
            "Content-Type": "text/css",
          },
        });
      },
    },

    "/EU-PIC.jpg": {
      GET: async (req) => {
        const jpg = Bun.file("front_end/EU-PIC.jpg");
    if (!(await jpg.exists())) {
      return new Response("Image not found", { status: 404 });
    }
        return new Response(jpg, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        });
      },
    },
    
    },

    port: 3000,
    fetch(req) {
        return new Response("Not Found", {status:404 });
    },
});

console.log(`Listening on http://localhost:${server.port}`)