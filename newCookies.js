import { Cookie } from "bun";
import { caesarCipher } from "./Cipher";


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
    const StudentSingIn = caesarCipher("StudentSign-In");
    const value = caesarCipher(Enumber);

    const cookie = new Bun.Cookie({
        name: StudentSingIn,
        value: value,
        expires: new Date(Date.now() + 86400000),
        secure: true,
        sameSite: "none",
        httpOnly: false,
        sameSite: "lax",
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
    const { Enumber } = await req.json();
    const TeacherSingIn = caesarCipher("StudentSign-In");
    const value = caesarCipher(Enumber);

    const cookie = new Bun.Cookie({
        name: TeacherSingIn,
        value: value,
        expires: new Date(Date.now() + 86400000),
        secure: false,
        sameSite: "none",
        httpOnly: true,
        sameSite: "lax",
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

    const AdminSingIn = caesarCipher("StudentSign-In");
    const value = caesarCipher(Enumber);

    const cookie = new Bun.Cookie({
        name: AdminSingIn,
        value: value,
        expires: new Date(Date.now() + 86400000),
        secure: false,
        sameSite: "none",
        httpOnly: true,
        sameSite: "lax",
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