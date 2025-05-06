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

export async function get_meeting_by_id(db, req) {
    try {
        const data = await db.select().from(meetings).where(eq(meetings.id, req.params.id));
        return data;

    } catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}

export async function create_meeting(db, req) {
    
    try{
        const {location, date, cancelled, class_id} = req.json(); 
        const data = await db.insert(meetings).values({location: location, date: date, qrcode: qrcode, cancelled: cancelled, class_id: class_id});

        var link =  `http://localhost:3000/student-check-in-page/${data.id}`;
        const data_with_qr = await db.update(meetings).values({qrcode: encodeURI(link)}); //UNTESTED AND GROSS BUT SHOULD WORK

        return data_with_qr;
    }catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}

export async function delete_meeting(db, req) {
    try{
        const data = await db.delete(classes).where(eq(classes.id, req.params.id));
        return data;
    }catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}

export async function update_meeting(db, req) {
    try{
        const {location, date, qrcode, cancelled, class_id} = req.json();
        const data = await db.update(meetings).set(
            {
                location: location,
                date: date,
                qrcode: qrcode,
                cancelled: cancelled,
                class_id: class_id
            }).where(eq( meetings.id, req.params.id));
        
        return data

    }catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}