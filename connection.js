const mysql = require("mysql");
require("dotenv").config();

var mysqlConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	multipleStatements: true,
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});

mysqlConnection.connect((err) => {
	if (!err) {
		console.log("Connected");
	} else {
		console.log(err);
	}
});

module.exports = mysqlConnection;
