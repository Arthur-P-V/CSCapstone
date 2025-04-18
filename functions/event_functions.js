import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { events } from "../db/schema/events";
import { eq, ne, gt, gte} from "drizzle-orm";

// Event functions
// Get all the events from the events table
export async function get_all_events(db) {
    try{
        const data = await db.select().from(events);
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}
// get a specific event by id
export async function get_event_by_id(db, req) {
    try{
        const data = await db.select().from(events).where(eq(events.id, req.params.id));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

// create a new event and put it in the event table
export async function create_event(db, req) {
    try{
        const {name, location, current_qr, description, type, meeting_time} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter
        const new_event = await db.insert(events).values({event_name: name, location: location, current_qr: current_qr, description: description, type: type});
        return "Post Successful!"
    }catch (error) {
        console.error("An Error Occurred: ", error.message)
    }
}

// removes an event from the event table
export async function delete_event(db, req) {
    try{
        const data = await db.delete(events).where(eq(events.id, req.params.id));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}