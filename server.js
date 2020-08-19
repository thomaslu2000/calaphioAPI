const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PeopleRoutes = require("./routes/people");
const EventsRoutes = require("./routes/Events");
const GeneralRoutes = require("./routes/general");

const cors = require("cors");

var app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());

app.use("/people", PeopleRoutes);
app.use("/events", EventsRoutes);
app.use("/general/", GeneralRoutes);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3001);
