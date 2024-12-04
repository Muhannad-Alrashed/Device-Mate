const mysql = require("mysql2");
require("dotenv").config();

// Decide connection type based on an environment variable
const isCloudDB = process.env.USE_CLOUD_DB === "true";

// Create connection object dynamically
const dbConfig = isCloudDB
  ? {
    // Cloud database configuration
    host: process.env.RAILWAY_PRIVATE_DOMAIN,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306, // MySQL default port
  }
  : {
    // Local database configuration
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
  console.log(`Connected to ${isCloudDB ? "cloud" : "local"} MySQL database.`);
});

module.exports = db;
