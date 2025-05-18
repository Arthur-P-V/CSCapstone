import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { meetings } from "../db/schema/meetings";
import { classes } from "../db/schema/classes";
import { users } from "../db/schema/users";
import { eq, ne, gt, gte, and} from "drizzle-orm";
import { parseJsonText } from "typescript";

export async function get_all_meetings(db) {
    
    try{
        const data = await db.select().from(meetings).innerJoin(classes, eq(meetings.class_id, classes.id)).innerJoin(users, eq(classes.teacher, users.id));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

export async function get_meeting_by_id(db, req) {

    try {
        const data = await db.select().from(meetings).where(eq(meetings.id, req.params.id)).innerJoin(classes, eq(meetings.class_id, classes.id));
        return data;

    } catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}

export async function create_meeting(db, req) {

    try{
        const { class_id, location, date, cancelled } = await req.json(); 

        const date_object = new Date(date);

        const data = await db.insert(meetings).values({location: location, date: date_object, cancelled: cancelled, class_id: class_id}).$returningId();

        var link =  `https://cscapstone-production.up.railway.app/student-check-in/${data[0].id}`;
        var encoded_link = encodeURI(link);

        const data_with_qr = await db.update(meetings).set(
        {
         qrcode: encoded_link
        }).where(eq(meetings.id, data[0].id));

        //return data_with_qr;
        return data[0].id;

    }catch (error) {
        console.error("An Error Occurred: ", error.message);
    }

}

export async function delete_meeting(db, req) {
    try{
        const data = await db.delete(meetings).where(eq(meetings.id, req.params.id));
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