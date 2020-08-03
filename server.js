const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const PeopleRoutes = require("./routes/people");
const EventsRoutes = require("./routes/Events");

const cors = require("cors");

var app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/people", PeopleRoutes);
app.use("/events", EventsRoutes);

app.listen(3001);
