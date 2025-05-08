import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../db/schema/users";
import { eq, ne, gt, gte} from "drizzle-orm";

// User functions
// Get all of the users from the users table
export async function get_all_users(db) {
    try{
        const data = await db.select().from(users);
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

// Search up a specfic user by enumber
export async function get_user_by_eNumber(db, req) {
    try{
        const data = await db.select().from(users).where(eq(users.eNumber, req.params.eNumber));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

// Create a new user in the users table
export async function create_user(db, req) {
    try{
        const {id, eNumber, password_hash, admin, first_name, last_name} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter                                                      
        const new_event = await db.insert(users).values({id:id, eNumber:eNumber, password_hash:password_hash, admin:admin, first_name:first_name, last_name:last_name});
        return "Post Successful!"
    }catch (error) {
        console.error("An Error Occurred: ", error.message)
    }
}

// TODO:
// Update User function


// Deletes a user from the users table
export async function delete_user(db, req) {
    try{
        const data = await db.delete(users).where(eq(users.eNumber, req.params.eNumber));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}