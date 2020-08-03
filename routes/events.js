const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.get("/", (req, res) => {
	console.log(req.query);
	mysqlConnection.query(
		"SELECT * from apo_calendar_event LIMIT 10",
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/day", (req, res) => {
	let date = req.query.date;
	mysqlConnection.query(
		"SELECT event_id, title, location, description, time_start, time_end, time_allday, " +
			"type_interchapter, type_service_chapter, type_service_campus, type_service_community, type_service_country, type_fellowship, " +
			"type_fundraiser, creator_id, start_at, end_at FROM apo_calendar_event " +
			`WHERE deleted=0 AND date='${date}'`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/counts", (req, res) => {
	let startDate = req.query.startDate;
	let endDate = req.query.endDate;
	mysqlConnection.query(
		"SELECT date, SUM(type_service_chapter | type_service_campus | type_service_community | type_service_country) as service, " +
			"SUM(type_fellowship) as fellowships, " +
			"COUNT(*) as total FROM apo_calendar_event " +
			`WHERE date >= '${startDate}' AND date <= '${endDate}' AND deleted=0 GROUP BY date`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.get("/attending", (req, res) => {
	let eventId = req.query.eventId;
	mysqlConnection.query(
		"SELECT a.user_id as uid, signup_time, chair, firstname, lastname FROM apo_calendar_attend as a JOIN apo_users as u USING (user_id) " +
			`WHERE event_id = ${eventId}`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/signUp", (req, res) => {
	mysqlConnection.query(
		"INSERT INTO `apo_calendar_attend`(`event_id`, `user_id`, `signup_time`) " +
			`VALUES (${req.body.eventId}, ${req.body.userId}, '${req.body.timestamp}')`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/signOff", (req, res) => {
	mysqlConnection.query(
		"DELETE FROM `apo_calendar_attend` " +
			`WHERE event_id=${req.body.eventId} AND user_id=${req.body.userId}`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/changeChair", (req, res) => {
	mysqlConnection.query(
		"UPDATE `apo_calendar_attend` " +
			`SET chair=${req.body.setting} ` +
			`WHERE event_id=${req.body.eventId} AND user_id=${req.body.userId}`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/create", (req, res) => {
	let data = req.body;
	mysqlConnection.query(
		"INSERT INTO `apo_calendar_event` (`title`, `location`, `description`, `date`, `time_start`, `time_end`, `time_allday`, " +
			"`type_interchapter`, `type_service_chapter`, `type_service_campus`, `type_service_community`, `type_service_country`, `type_fellowship`, `type_fundraiser`, `creator_id`, `start_at`, `end_at`) " +
			`VALUES ('${data.title}', '${data.location}', '${
				data.description
			}', '${data.date}', '${data.time_start}', '${data.time_end}', '${
				data.time_allday ? 1 : 0
			}', ` +
			`'${data.type_interchapter ? 1 : 0}', '${
				data.type_service_chapter ? 1 : 0
			}', '${data.type_service_campus ? 1 : 0}', '${
				data.type_service_community ? 1 : 0
			}', '${data.type_service_country ? 1 : 0}', '${
				data.type_fellowship ? 1 : 0
			}', '${data.type_fundraiser ? 1 : 0}', '${data.creator_id}', '${
				data.start_at
			}', '${data.end_at}')`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/delete", (req, res) => {
	let data = req.body;
	mysqlConnection.query(
		"UPDATE `apo_calendar_event` SET deleted=1, " +
			`creator_id=${data.userId} WHERE event_id=${data.eventId}`,
		(err, rows, fields) => {
			if (!err) {
				res.send(rows);
			} else {
				console.log(err);
			}
		}
	);
});

Router.post("/edit", (req, res) => {
	let data = req.body;
	let eid = data.eventId;
	delete data.eventId;
	let updates = Object.entries(data).map(([k, v]) => {
		return `${k}='${v}'`;
	});
	mysqlConnection.query(
		"UPDATE `apo_calendar_event` SET " +
			updates.join(", ") +
			` WHERE event_id=${eid}`,
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
