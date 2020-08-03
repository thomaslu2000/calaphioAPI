const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.post("/login", (req, res) => {
	let email = req.body.email;
	let passphrase = req.body.passphrase;
	mysqlConnection.query(
		"SELECT user_id, firstname, disabled FROM apo_users " +
			`WHERE email='${email}' AND passphrase=sha1(concat(salt, '${passphrase}')) LIMIT 1`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/admin", (req, res) => {
	mysqlConnection.query(
		"SELECT 1 FROM `apo_permissions_groups` " +
			`WHERE user_id=${req.query.userId} AND group_id=1`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/adminOrChair", (req, res) => {
	mysqlConnection.query(
		"SELECT 1 FROM `apo_permissions_groups` " +
			`WHERE user_id=${req.query.userId} AND group_id=1 ` +
			"UNION SELECT 1 from apo_calendar_attend " +
			`WHERE user_id=${req.query.userId} AND event_id=${req.query.eventId} AND chair=1`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

module.exports = Router;
