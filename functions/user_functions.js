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
        const {id, eNumber, password, admin, first_name, last_name} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter                                                      
        const hash = await Bun.password.hash(password);
        const new_event = await db.insert(users).values({id:id, eNumber:eNumber, password_hash:hash, admin:admin, first_name:first_name, last_name:last_name});
        return "Post Successful!"
    }catch (error) {
        console.error("An Error Occurred: ", error.message)
    }
}

// Update a users password
export async function update_password(db, req){
    try{
        const {id, password} = await req.json();
        const hash = await Bun.password.hash(password);
        const data = await db.update(users).set(
            {
                password_hash: hash
            
            }).where(eq(users.id, Number(id)));
            
        return data;
    }
    catch(error){
        console.error("An Error Occured: ", error.message);
    }
}


// Deletes a user from the users table
export async function delete_user(db, req) {
    try{
        const data = await db.delete(users).where(eq(users.eNumber, req.params.eNumber));
        return data
    } catch (error) {
        console.error("An Error Occurred: ", error.message)
    }

}

export async function verify(db, req) {
  try {
    const user = req.params.username;
    const password = req.params.password;

    // Await the DB query and get the actual result
    const result = await db
      .select({ password_hash: users.password_hash })
      .from(users)
      .where(eq(users.eNumber, user));

    if (!result || result.length === 0) {
      return new Response("User not found", { status: 404 });
    }

    const passwordHash = result[0].password_hash;

    const isValid = await Bun.password.verify(password, passwordHash);
    return new Response(JSON.stringify({ valid: isValid }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error verifying username:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}