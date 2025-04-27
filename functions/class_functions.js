import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { classes } from "../db/schema/classes";
import { eq, ne, gt, gte} from "drizzle-orm";

// Class functions
// Get all the Classes from the Class table
export async function get_all_classes(db) {
    try{
        const data = await db.select().from(classes);
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}
// get a specific Class by id
export async function get_class_by_id(db, req) {
    try{
        const data = await db.select().from(classes).where(eq(classes.id, req.params.id));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

// create a new Class and put it in the Class table
export async function create_class(db, req) {
    try{
        const {name, description, teacher, recurring} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter
        const new_class = await db.insert(classes).values({name: name, description: description, teacher: teacher, recurring: recurring});
        return "Post Successful!";
    }catch (error) {
        console.error("An Error Occurred: ", error.message)
    }
}

// removes a class from the Class table
export async function delete_class(db, req) {
    try{
        const data = await db.delete(classes).where(eq(classes.id, req.params.id));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}