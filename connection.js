const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "website",
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
