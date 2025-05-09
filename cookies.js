import { Cookie } from "bun";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",  // Adjust as needed
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true", // Allow cookies

};


const server = Bun.serve({ 
    port: 8080,
    async fetch(req) {
        const url = new URL(req.url);
        console.log("FETCH handler triggered");
        const path = url.pathname.replace(/\/+$/, "");

        console.log(`Received ${req.method} request for ${req.url}`); // Log method and URL
        console.log("Path:", path);
         
        // Handle OPTIONS preflight request (CORS)
        console.log("Method:", req.method);
        console.log("Pathname:", url.pathname);

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 200, headers: CORS_HEADERS });
        }

        if (req.method === "GET" && url.pathname === "/student-login") {
            const file = Bun.file("student-login.html");
            return new Response(file, {
                headers: {
                    "Content-Type": "text/html",
                    ...CORS_HEADERS,
                },
            });
        }
        
        //the /login can change 
        if(req.method === "POST" && path  === "/student-login" ){
            try{
                //we can ass more on what we want to keep
                const data = await req.json();
                const { Enumber, password } = data;
                console.log("Received Enumber:", Enumber);

                //const isProd = req.url.startsWith("https");

                /*if (!Enumber) {
                    return new Response("Invalid credentials", { status: 400 });
                }*/

                //we can check for the password verify 

                const isProd = req.url.startsWith("https");

                const cookie = new Bun.Cookie({
                    name: "session",
                    value: Enumber,
                    expires: new Date(Date.now() + 86400000),
                    secure: isProd,
                    sameSite: "lax",
                    httpOnly: true,
                  });
                
                //return response and sets the cookie, this doesnt send a cookie to a database
                return  new Response("Logged In", {
                    headers: {
                        "Set-Cookie": cookie.toString(),
                    ...CORS_HEADERS,
                    },
                });
        }
        catch (err){
        console.error("Error handling login:", err);
        return new Response("Bad Request", { 
            status: 400,
            headers: CORS_HEADERS,
         });
        }
    }
    return new Response("Not found", { 
        status: 404, 
        headers: CORS_HEADERS,
    });
    },
});

console.log(`Listening on https://cscapstone-production.up.railway.app/student-login`);



/*
 const { Enumber, password } = await req.json();
                console.log("Received Enumber:", Enumber);

                if (!Enumber) {
                    return new Response("Invalid credentials", { status: 400 });
                }

                //we can check for the password verify 

                const cookie = new Bun.Cookie({
                    name: "session",
                    value: Enumber,
                    expires: new Date(Date.now() + 86400000),
                    secure: false,
                    sameSite: "lax",
                    httpOnly: true,
                  });
                
*/