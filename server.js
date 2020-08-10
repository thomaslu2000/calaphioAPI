const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const PeopleRoutes = require("./routes/people");
const EventsRoutes = require("./routes/Events");
const GeneralRoutes = require("./routes/general");

const cors = require("cors");

var app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/people", PeopleRoutes);
app.use("/events", EventsRoutes);
app.use("/general/", GeneralRoutes);

app.listen(3001);
