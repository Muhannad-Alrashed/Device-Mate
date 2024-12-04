require("dotenv").config();

const urlDB = `mysql://
                ${process.env.MYSQLUSER}:
                ${process.env.MYSQL_ROOT_PASSWORD}@
                ${process.env.RAILWAY_PRIVATE_DOMAIN}:3306/
                ${process.env.MYSQL_DATABASE}`

const connection = mysql.createConnection(urlDB);

module.exports = connection;