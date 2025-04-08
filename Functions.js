import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";
import { exists } from "drizzle-orm";

export async function getUsersData(db){
    // Gets all the data from users
    const data = await db.select().from(users);
    return data;
}

/* TODO
Get all user data

Create New User function

Login function




*/