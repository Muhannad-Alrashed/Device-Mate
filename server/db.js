const mysql = require("mysql2");
require("dotenv").config();

// Connect to local database
const db = mysql.createConnection({
  host: process.env.DB_Host,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

//Connect to cloud database
// const urlDB = `mysql://
//                 ${process.env.MYSQLUSER}:
//                 ${process.env.MYSQL_ROOT_PASSWORD}@
//                 ${process.env.RAILWAY_PRIVATE_DOMAIN}:3306/
//                 ${process.env.MYSQL_DATABASE}`
// const db = mysql.createConnection(urlDB);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
