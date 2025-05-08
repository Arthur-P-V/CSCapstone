import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
//import { user } from './test/schema/user.ts';


// Set up a connection to the MySQL database
const connection = await mysql.createConnection({
  host: process.env.HOST,        // MySQL server host
  user: process.env.USER,    // Your MySQL username
  password: process.env.PASSWORD, // Your MySQL password
  database: process.env.DATABASE, // The database you want to query
});

// Connect to MySQL database
export const db = drizzle(connection);

// Function to insert a username into the 'users' table
async function insert(username, password) {
    try {
      // Insert a new username into the 'users' table
      const newpassword = password
      const hash = await Bun.password.hash(newpassword);


      //createnewuser  might return the hash
      await db.insert(users).values({eNumber: username, password_hash: hash});

      console.log('Inserted username and password: ${username}');
    } catch (error) {
      console.error('Error inserting username:', error);
    } finally {
      // Close the database connection
      await connection.end();
    }
  }
  
  // Insert a new username (example)
  insert('e0716553', 'Password');


