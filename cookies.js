import { Cookie } from "bun";

const server = Bun.serve({ 
    async fetch(req) {
        const url = new URL(req.url);
        
        //the /login can change 
        if( url.pathname === "/login" && req.method === "POST" ){
                //we can ass more on what we want to keep
                const { Enumber } = await req.json();

                //we can check for the password verify 

                    const cookie = new Bun.Cookie({
                        name: 'session',
                        value: Enumber,
                        expires: new Date(Date.now() + 86400000),
                        secure: true,
                        sameSite: "strict",
                        httpOnly: true,
                    })
                
                //return response and sets the cookie, this doesnt send a cookie to a database
                return new Response("Logged In", {
                    header: {
                        "Set-Cookie": cookie.toString(),
                    },
                });
        }

    },
});