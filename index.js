import { drizzle } from "drizzle-orm/mysql2";
import mysql, { escape } from "mysql2/promise";
import { BlobServiceClient } from "@azure/storage-blob";

import { classes } from "./db/schema/classes";
import { eq, ne, gt, gte} from "drizzle-orm";

import {create_class, delete_class, get_all_classes, get_class_by_id, update_class} from "./functions/class_functions";
import { get_all_users, get_user_by_eNumber, delete_user, create_user, update_password, verifyStudentPassword, verifyTeacherPassword, verifyAdminPassword, get_all_students, get_all_teachers } from "./functions/user_functions";
import { get_all_meetings, get_meeting_by_id, create_meeting, update_meeting, delete_meeting } from "./functions/meeting_functions";
import { create_attendance_record, mark_checked_in, get_all_attendance } from "./functions/attendance_functions";


import index from "./front_end/index.html";

import { AdminCookies, StudentCookies, Option, TeacherCookies } from "./newCookies";
import { decipher } from "./Cipher";

const studentCookieId = "StudentSign-In";
const teacherCookieId = "TeacherSign-In";
const adminCookieId = "AdminSign-In";

// Making a connection with mySQL
const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// ---------------------------------------------------------------------------------------------
// This is connecting to the bucket so we can save .csv files, and pull them from the azure server. 

        // This is the connection string to connect to the azzure server. Will have to update every time it expiers
const AZURE_STORAGE_CONNECTION_STRING = process.env.CONNECTION_STRING;
        // This is what the container is called (the parent folder)
const containerName = process.env.CONTAINER_NAME;
        // Creating a connection to azure server
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        // Goes into the "folder" we are saving into (we are saving in folder data)
const containerClient = blobServiceClient.getContainerClient(containerName);
        // Wait till we are connected
await containerClient.createIfNotExists();

// ---------------------------------------------------------------------------------------------

// Create a datebase connection
const db = drizzle({ client: connection });

const response = await db.select().from(classes);

console.log("Hello via Bun!");

const server = Bun.serve({

    routes: {
        "/api/upload_roster":{
            // Uploading a roster with a post request
            POST: async (req) => {
                // Upload a roster, need to pass the .csv as a file type
                // Pull the data from the req (take the data that was passed to it)
                const formData = await req.formData();
                const file = formData.get("file");
                // Make sure the file is there
                if(!file || typeof file === "string"){
                    return new Response("No file uploaded", {status: 400});
                }
                // Build a buffer, then parse the file into it
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                // Upload the file to the azure server with its name
                const blockBlobClient = containerClient.getBlockBlobClient(file.name);
                await blockBlobClient.upload(buffer, buffer.length);

                return new Response(`File ${file.name} uploaded successfully!`);
                }
        },

        "/api/download_roster/:roster":{
            // You can get a specific roster file by name, we will store the name in the class table. 
            GET: async req =>{
                // Grab the name from the url
                const blobName = req.params.roster;
                // If there is no name, then it throws error
                if(!blobName){
                    return new Response("Missing 'file' parameter", {status: 400});
                }
                // Check if the file exists
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                const exists = await blockBlobClient.exists();
                if(!exists){
                    return new Response("File not found", {status: 404});
                }
                // If the file exists we should pull the file and display it.
                // Curently is downloading to the local machine, want to do somthing different when we have a better idea of how we are displaying.
                const downloadBlockBlobResponse = await blockBlobClient.download();
                const readable = downloadBlockBlobResponse.readableStreamBody;
                // Returning the .csv in readable json
                return new Response(readable, {
                    headers: {
                        "Content-Type": "text/plain",
                        "Content-Dispostion": 'inline; filename="${blobName}"',
                    }
                });
           }
        },

        //// This is the route that will upload csv data to the storage container (azure)
        
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
      },
      // Delete user by eNumber
        DELETE: async req => {
           const data = await delete_user(db, req);
           return Response.json(data);
       },
       
        PUT: async req => {
            const data = await update_password(db, req);
            return Response.json({ valid: data});
            }
        },
        // Searches up by enumber
        "/api/user/:eNumber":{
        // Get user by eNumber
        GET: async req => {
          const data = await get_user_by_eNumber(db, req);
          return Response.json(data);
       }
      },

        // Get students
        "/api/getStudents":{
            GET: async req => {
          const data = await get_all_students(db, req);
          return Response.json(data, {
            headers: {
                "Content-Type" : "application/json"
            }
          });
            },

        },
        // 
        "/api/getTeachers":{
            GET: async req => { 
          const data = await get_all_teachers(db, req);
          return Response.json(data);
            },
        },
        "/api/verifyStudentPassword":{
            POST: async (req) => {
                const data = await verifyStudentPassword(db, req);
                return Response.json(data);
            }
        },

        "/api/verifyTeacherPassword":{
            POST: async (req) => {
                const data = await verifyTeacherPassword(db, req);
                return Response.json(data);
            }
        },

        "/api/verifyAdminPassword":{
            POST: async (req) => {
                const data = await verifyAdminPassword(db, req);
                return Response.json(data);
            }
        },

        "/api/hash":{
            POST: async (req) => {
                const data = await hash(db, req);
                return Response.json(data);
            }
        },



      // Loads all the events or create a new event

        "/api/classes": { //Considering adding an optional URL param that will allow us to snag all classes associated with one user
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
                const data = await update_class(db, req);
                return Response.json(data);
            }
        },

        


        "/api/meetings": { //Considering adding an optional URL param that will allow us to snag all meetings associated with one class
            GET: async req => {
                const data = await get_all_meetings(db);
                return Response.json(data);
            },
            POST: async req => {
                const data = await create_meeting(db, req);
                return Response.json(data);
            }
        },

        "/api/meetings/:id": {
            GET: async req => {
                const data = await get_meeting_by_id(db, req);
                return Response.json(data);
            },
            DELETE: async req => {
                const data = await delete_meeting(db, req);
                return Response.json(data);
            },
            PUT: async req => {
                const data = await update_meeting(db, req);
                return Response.json(data);
            },
        },

        "/api/attendance": {
            GET: async () => {
               const data = await get_all_attendance(db);
               return Response.json(data);
             },
            POST: async (req) => {
               const data = await create_attendance_record(db, req);
               return Response.json(data);
            },
           PUT: async (req) => {
              const data = await mark_checked_in(db, req);
              return Response.json(data);
            }
        },


        // The front end, this is using functions in the "front_end" folder and creating front end pages.
        // index.html (homepage)
        "/*":index,

        // Making the homepage
        "/homepage":index,

        // Student pages
        "/student-login":{
            GET: async (req) =>{

                const cookie = req.headers.get("cookie") || "";
                const CookieName = cookie.substring(0, '=');

                DecodedName = decipher(CookieName);

                 // Check if StudentSignIn cookie exists
                if ( DecodedName === "StudentSignIn=") {
                    return new Response(null, {
                        status: 302,
                        headers: {
                        Location: "/student-dashboard",
                        },
                    });
                 }

                const html = await Bun.file("front_end/student-login.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },

            POST: StudentCookies,
            OPTIONS: Option,

        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation (this will check if they have a cookie or not and that will determine what is done)
        "/student-check-in-login/:class_id":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/student-check-in-login.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/student-dashboard":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/student-dashboard.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },

        // Dont need cookies for this because they are creating a new account
        "/student-new-user":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/new-student-user.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },

        // I dont think we need cookies for this one
        // I think we will be able topass all the information through json
        "/student-confirmation/:class_id":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/confirmation.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },

        // Need to implement and work on. 
        // I think we will be able to pass all the information through json
        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/student-check-in/:class_id":{
            GET: async (req) =>{
                const html = await Bun.file("front_end/check-in.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },
        },

        // Teacher pages
        "/teacher-login":{
            GET: async (req) =>{

               const cookie = req.headers.get("cookie") || "";
               const CookieName = cookie.substring(0, '=');

               DecodedName = decipher(CookieName);

                // Check if StudentSignIn cookie exists
               if (DecodedName === "TeacherSign-In") {
                   return new Response(null, {
                       status: 302,
                       headers: {
                       Location: "/teacher/dashboard",
                       },
                   });
                }
                else if (DecodedName === "StudentSign-In") {
                   return new Response(null, {
                       status: 302,
                       headers: {
                       Location: "/student-dashboard",
                       },
                   });
                }

                const html = await Bun.file("front_end/teacher-login.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },

            POST: TeacherCookies,
            OPTIONS: Option,
        },

        "/teacher/dashboard":{
            GET: async (req) =>{
                const cookie = req.headers.get("cookie") || "";
                const CookieName = cookie.substring(0, '=');

                DecodedName = decipher(CookieName);

                if (DecodedName === "TeacherSign-In") {
                const html = await Bun.file("front_end/teacher-dashboard.html").text();
                return new Response(html, {
                    status: 302,
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
                }
                else{
                    return new Response(null, {
                        status: 301,
                        headers: {
                        Location: "/homepage"
                        },
                    });
                }
                
                

            },
        },

        // Teacher and Admin pages
        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/admin-teacher-dashboard":{
            // Has either a admin cookie, teacher cookie, or be redirected to the home page
            GET: async (req) =>{
                const cookie = req.headers.get("cookie") || "";
                const CookieName = cookie.substring(0, '=');

                DecodedName = decipher(CookieName);

                if (DecodedName === "AdminSign-In") {
                
                return new Response(null, {
                    status: 301,
                    headers: {
                        Location: "/admin/dashboard",
                    },
                });
                }
                else if (DecodedName === "TeacherSign-In") {
                return new Response(null, {
                    status: 301,
                    headers: {
                        Location: "/admin/dashboard"
                    },
                });
                }
                else{
                    return new Response(null, {
                        status: 301,
                        headers: {
                        Location: "/"
                        },
                    });
                }
                
                

            },

        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/create-class":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/create-class.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/library":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/library.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/manage-templates":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/manage-templates.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/create-event":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/create-event.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },

        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/QR-display/:id":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/QR-display.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },
        // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
        "/reports/:classId":{
            GET: async (req) =>{
            const html = await Bun.file("front_end/reports.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
            },
        },

        // Admin pages
        "/admin-login":{
            GET: async (req) =>{

                const cookie = await req.headers.get("cookie") || "";
                const CookieName = cookie.substring(0, '=');

                DecodedName = decipher(CookieName);
                
                 // Check if StudentSignIn cookie exists
                 if (DecodedName === "AdminSign-In") {
                    return new Response(null, {
                        status: 302,
                        headers: {
                        Location: "admin/dashboard",
                        },
                    });
                 }
                 else if (DecodedName === "TeacherSign-In") {
                    return new Response(null, {
                        status: 302,
                        headers: {
                        Location: "teacher/dashboard",
                        },
                    });
                 }
                 else if (DecodedName === "StudentSign-In") {
                    return new Response(null, {
                        status: 302,
                        headers: {
                        Location: "student-dashboard",
                        },
                    });
                 }
                
                const html = await Bun.file("front_end/admin-login.html").text();
                return new Response(html, {
                    headers: {
                        "Content-Type": "text/html",
                    },
                });
            },

            POST: AdminCookies,
            OPTIONS: Option,

        },
        // Can use this as a template for what to do for cookies
      "/admin/dashboard":{
        GET: async (req) =>{

            const cookie = req.headers.get("cookie") || "";
            const CookieName = cookie.substring(0, '=');

            DecodedName = decipher(CookieName);

            if (DecodedName === "AdminSign-In") {
                const html = await Bun.file("front_end/admin-dashboard.html").text();
            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
            });
               
             }
             else{
                    return new Response(null, {
                        status: 302,
                        headers: {
                        Location: "/admin-login"
                        },
                    });
                }
             
            },
      },

      // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
      "/admin/class-view":{
        GET: async (req) =>{
            const cookie = req.headers.get("cookie") || "";
            const CookieName = cookie.substring(0, '=');

            DecodedName = decipher(CookieName);
            if (DecodedName === "AdminSign-In") {   
                const html = await Bun.file("front_end/admin-class-view.html").text();
                return new Response(html, {
              headers: {
                  "Content-Type": "text/html",
              },
          });
        }
        else{
            return new Response(null, {
                status: 302,
                headers: {
                Location: "/admin-login"
                },
            });
        }
        
        },
      },

      // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
      "/admin/create-teacher":{
        GET: async (req) =>{

            const cookie = req.headers.get("cookie") || "";
            const CookieName = cookie.substring(0, '=');

            DecodedName = decipher(CookieName);
            if (DecodedName === "AdminSign-In"){
          const html = await Bun.file("front_end/create-teacher-account.html").text();
          return new Response(html, {
              headers: {
                  "Content-Type": "text/html",
              },
          });
        }
        else{
            return new Response(null, {
                status: 302,
                headers: {
                Location: "/admin-login"
                },
            });
        }
        },
      },

      // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
      "/admin/view-teachers":{
        GET: async (req) =>{

            const cookie = req.headers.get("cookie") || "";
            const CookieName = cookie.substring(0, '=');

            DecodedName = decipher(CookieName);
            if (DecodedName === "AdminSign-In"){  
                 const html = await Bun.file("front_end/view-teachers.html").text();
                return new Response(html, {
                 headers: {
                    "Content-Type": "text/html",
                    },
                });
            }
            else{
                return new Response(null, {
                    status: 302,
                    headers: {
                    Location: "/admin-login"
                    },
                });
            }

        },
      },

      // -----------------------------------------------------------------------------------------------------------------------------
        // Need to add cookie validation
      "/admin/view-students":{
        GET: async (req) =>{

            const cookie = req.headers.get("cookie") || "";
            const CookieName = cookie.substring(0, '=');

            DecodedName = decipher(CookieName);
            if (DecodedName === "AdminSign-In"){  
                const html = await Bun.file("front_end/view-students.html").text();
                return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
                });
            }
            else{
                return new Response(null, {
                    status: 302,
                    headers: {
                    Location: "/admin-login"
                    },
                });
            }
        },
      },

      



  // The Styles and Images used on the website
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
    
    port: 8080,
    fetch(req) {
        return new Response("Not Found", {status:404 });
    },
    
});

console.log(`Listening on http://localhost:${server.port}`)
