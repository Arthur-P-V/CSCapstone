import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { meetings } from "../db/schema/meetings";
import { eq, ne, gt, gte} from "drizzle-orm";

export async function get_all_meetings(db) {
    try{
        const data = await db.select().from(meetings);
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}