import { Cookie } from "bun";

const server = Bun.serve({ 
    port: 3000,
    routes: {
        // Define the login route
        "/login": async (req) =>  {
        const url = new URL(req.url);

        console.log(`Received ${req.method} request for ${req.url}`); // Log method and URL

        const headers = {
            "Access-Control-Allow-Origin": "*",  // Adjust as needed
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true", // Allow cookies
          };


        // Handle OPTIONS preflight request (CORS)
        if (req.method === "OPTIONS") {
            return new Response(null, { headers });  // Just respond with the headers
        }
        
        //the /login can change 
        if(req.method === "POST" ){
            try{
                //we can ass more on what we want to keep
                const { Enumber } = await req.json();
                console.log("Received Enumber:", Enumber);

                if (!Enumber) {
                    return new Response("Invalid credentials", { status: 400 });
                }
                else{
                    console.log("Received Enumber:", Enumber);
                }

                //we can check for the password verify 

                const cookie = new Bun.Cookie({
                    name: "session",
                    value: Enumber,
                    expires: new Date(Date.now() + 86400000),
                    secure: false,
                    sameSite: "None",
                    httpOnly: true,
                  });
                
                //return response and sets the cookie, this doesnt send a cookie to a database
                return new Response("Logged In", {
                    headers: {
                        "Set-Cookie": cookie.toString(),
                    ...headers
                    },
                });
        }
        catch (err){
        console.error("Error handling login:", err);
        return new Response("Bad Request", { status: 400 });
        }
    }
    return new Response("Not found", { status: 404 });
    },
    },
});

console.log(`Listening on http://localhost:${server.port}`)



/* for the wedpage
 document.getElementById("loginForm").addEventListener("submit", async function(event){
      event.preventDefault();

      const enumber = document.getElementById("eNumber").value;
      console.log("Sending Enumber:", enumber);
       
      const res = await fetch("http://localhost:3306/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Enumber: eNumber, password: password }), // Customize as needed
        credentials: "include" //  THIS tells browser to store cookies
       });

        const text = await res.text();
        console.log(text);

        if (res.ok) {
            const text = await res.text();
            console.log("Server response:", text);
  
            if (text === "Logged In") {
            // Cookie was set, navigate to confirm.html
             window.location.href = "confirm.html";
            }
             else {
                alert("Unexpected server response: " + text);
             }
        } else {
        alert("Login failed");
        }
    });
    */
