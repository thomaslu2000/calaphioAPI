const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.post("/login", (req, res) => {
	let email = req.body.email;
	let passphrase = req.body.passphrase;
	mysqlConnection.query(
		`SELECT user_id, firstname, disabled FROM apo_users \
		WHERE email='${email}' AND passphrase=sha1(concat(salt, '${passphrase}')) LIMIT 1`,
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
		`SELECT 1 FROM apo_permissions_groups \
		WHERE user_id=${req.query.userId} AND group_id=1`,
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
		`SELECT 1 FROM apo_permissions_groups \
		WHERE user_id=${req.query.userId} AND group_id=1 \
		UNION SELECT 1 from apo_calendar_attend \
		WHERE user_id=${req.query.userId} AND event_id=${req.query.eventId} AND chair=1`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/stats", (req, res) => {
	let data = req.query;
	mysqlConnection.query(
		`SELECT SUM(a.attended * a.hours * (e.type_service_chapter = 1 OR e.type_service_campus=1 OR e.type_service_community = 1 OR e.type_service_country = 1)) AS service_hours_attended, \
		SUM(a.flaked*a.hours * (e.type_service_chapter = 1 OR e.type_service_campus=1 OR e.type_service_community = 1 OR e.type_service_country = 1)) as service_hours_flaked, \
		SUM(a.attended * e.type_fellowship) as fellowships_attended, SUM(a.flaked * e.type_fellowship) as fellowships_flaked, SUM(a.chair * a.attended) AS events_chaired, \
		SUM(a.attended * e.type_fundraiser) as fundraisers_attended FROM apo_calendar_event e JOIN apo_calendar_attend a USING (event_id) \
		WHERE "${data.startDate}"<e.date AND e.date<"${data.endDate}" AND user_id=${data.userId}`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/toEval", (req, res) => {
	let data = req.query;
	mysqlConnection.query(
		`SELECT event_id, title \
		FROM apo_calendar_attend JOIN apo_calendar_event USING (event_id) \
		WHERE user_id=${data.userId} AND chair=1 AND evaluated=0 AND start_at < CURRENT_TIMESTAMP \
		ORDER BY start_at ASC`,
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
