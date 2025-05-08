import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from 'drizzle-orm';
import { get_user_by_eNumber } from './user_functions.js';



// Set up a connection to the MySQL database
const connection = await mysql.createConnection({
  host: process.env.HOST,        // MySQL server host
  user: process.env.USER,    // Your MySQL username
  password: process.env.PASSWORD, // Your MySQL password
  database: process.env.DATABASE // The database you want to query
});

// Connect to MySQL database
export const db = drizzle(connection);

// Function to verify a username and password matches
async function verify(username, password) {
    try {
      // Insert a new username into the 'users' table
      //const getusername = await db.select().from(users).where(eq(users.eNumber, username));
      get_user_by_eNumber(users, username);
      if(getusername.length == 0){
        console.error('Username does not exists.');
        return;
      }

      const userFound = getusername[0]; 
      const verify = await Bun.password.verify(password, userFound.password);

      if(verify == true){
        console.log('match');
      }
      else{
        console.log('try it again');
      }

    } catch (error) {
      console.error('Error verifying username:', error);
    } finally {
      // Close the database connection
      await connection.end();
    }
  }
  
  // verify a new username (example)
  verify('e0716553', 'Password');