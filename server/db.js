const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  database: "DeviceMateDB",
  user: "root",
  password: "my@sql@12345@",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
