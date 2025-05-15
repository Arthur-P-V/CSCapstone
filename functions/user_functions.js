import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../db/schema/users";
import { eq, ne, gt, gte, and} from "drizzle-orm";

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
        const { eNumber, password, admin, first_name, last_name} = await req.json(); //the const variables are actually matched to the json body returned by req.json(), the order doesn't matter                                                      
        const check_if_eNumber_exists = await db.select( {eNumber : users.eNumber}).from(users).where(eq( users.eNumber, eNumber));
        if( !check_if_eNumber_exists || check_if_eNumber_exists.length == 0){
            const hash = await Bun.password.hash(password);
            const new_event = await db.insert(users).values({ eNumber:eNumber, password_hash:hash, admin:admin, first_name:first_name, last_name:last_name});
            return true;
        }
        else{
            return false;
        }
        
    }catch (error) {
        console.error("An Error Occurred: ", error.message)
        return false;
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

export async function verifyStudentPassword(db, req) {
    
  try {
    const {username, password} = await req.json();
    
    
    // Await the DB query and see if the user is in the database
    const result = await db
      .select({ password_hash: users.password_hash })
      .from(users)
      .where(
        and(
        eq(users.eNumber, username),
        eq(users.admin, 0)  // This is checking to see if the account is a student
    ));
    
    if (!result || result.length === 0) {
      return false;
    }

    // Pulling the passwordHash from the querie
    const passwordHash = result[0].password_hash;
    
    // Using a built in function that compares plain text password to the hashed password
    const isValid = await Bun.password.verify(password, passwordHash);

    if(isValid){
        // The password is correct
        return true;
    }
    else{
        // The password is incorrect
        return false;
    }

  } catch (error) {
    console.error('Error verifying username:', error);
    return false;
  }
}

export async function verifyPassword(db, req) {
    
  try {
    const {username, password} = await req.json();
    
    
    // Await the DB query and see if the user is in the database
    const result = await db
      .select({ password_hash: users.password_hash })
      .from(users)
      .where(eq(users.eNumber, username));
    
    if (!result || result.length === 0) {
      return false;
    }

    // Pulling the passwordHash from the querie
    const passwordHash = result[0].password_hash;
    
    // Using a built in function that compares plain text password to the hashed password
    const isValid = await Bun.password.verify(password, passwordHash);

    if(isValid){
        // The password is correct
        return true;
    }
    else{
        // The password is incorrect
        return false;
    }

  } catch (error) {
    console.error('Error verifying username:', error);
    return false;
  }
}
