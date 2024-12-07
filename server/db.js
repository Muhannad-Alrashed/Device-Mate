const mysql = require("mysql2");
require("dotenv").config();

// Decide connection type based on an environment variable
const isCloudDB = process.env.USE_CLOUD_DB === "true";

// Create connection object dynamically
const dbConfig = isCloudDB
  ?
  // Cloud database configuration
  `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`
  : {
    // Local database configuration
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
  };

// Create the database connection
const db = mysql.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log(`Connected to ${isCloudDB ? "Cloud" : "Local"} MySQL Database.`);
});

module.exports = db;