import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";
import { exists } from "drizzle-orm";

export async function getAllUsersData(db){
    // Gets all the data from users
    const data = await db.select().from(users);
    return data;
}

export async function getSpecificUser(db){
    // Gets a specfic user from the database
    
    const data = await db.select().from(users).where(eq(db.eNumber, e0717443));
    return data;
}
/* TODO
Find Specific User

Generate Password Hash

Create New User function

Login function




*/