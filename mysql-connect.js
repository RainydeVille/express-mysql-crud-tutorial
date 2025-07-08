import dotenv from "dotenv";
dotenv.config(); // this loads variables from .env

import mysql from "mysql2/promise";

//create connection
console.log("🤓 Connecting to MySQL DB...");
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("Connection to database is successful. Have a great coding day Rainy👑");

export default connection;
