import { Cookie } from "bun";

export function Option(){
    return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:8080",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      });
 }

export async function StudentCookies(req){
    const { Enumber } = await req.json();

    const cookie = new Bun.Cookie({
        name: "StudentSign-In",
        value: Enumber,
        expires: new Date(Date.now() + 86400000),
        secure: false,
        sameSite: "none",
        httpOnly: true,
        });
                
                //return response and sets the cookie, this doesnt send a cookie to a database
    return  new Response("Logged In", {
        headers: {
            "Set-Cookie": cookie.toString(),
            "Access-Control-Allow-Origin": "https://localhost:8080",
            "Access-Control-Allow-Credentials": "true",
        },
    });
 }

 export async function TeacherCookies(req){
    const { Enumber, password } = await req.json();

    const cookie = new Bun.Cookie({
        name: "TeacherSign-In",
        value: Enumber,
        expires: new Date(Date.now() + 86400000),
        secure: false,
        sameSite: "none",
        httpOnly: true,
        });
                
                //return response and sets the cookie, this doesnt send a cookie to a database
    return  new Response("Logged In", {
        headers: {
            "Set-Cookie": cookie.toString(),
            "Access-Control-Allow-Origin": "https://localhost:8080",
            "Access-Control-Allow-Credentials": "true",
        },
    });
 }

 export async function AdminCookies(req){
    const { Enumber, password } = await req.json();

    const hash = bun.password.hash(AdminSign-In);

    const cookie = new Bun.Cookie({
        name: "AdminSign-In",
        value: Enumber,
        expires: new Date(Date.now() + 86400000),
        secure: false,
        sameSite: "none",
        httpOnly: true,
        });
                
                //return response and sets the cookie, this doesnt send a cookie to a database
    return  new Response("Logged In", {
        headers: {
            "Set-Cookie": cookie.toString(),
            "Access-Control-Allow-Origin": "https://localhost:8080",
            "Access-Control-Allow-Credentials": "true",
        },
    });
 }