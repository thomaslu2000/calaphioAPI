const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");

Router.get("/announcements", (req, res) => {
	mysqlConnection.query(
		"SELECT a.user_id, a.text, a.publish_time, a.title, u.firstname, u.lastname, u.pledgeclass, e.start \
        FROM apo_announcements a JOIN apo_users u \
        USING (user_id) JOIN (SELECT MAX(start) as start FROM apo_semesters) as e \
        WHERE a.publish_time > e.start \
        ORDER BY `a`.`publish_time` DESC",
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
