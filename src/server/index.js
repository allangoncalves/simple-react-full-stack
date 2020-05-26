const express = require("express");
const os = require("os");

const app = express();
var bodyParser = require("body-parser");
var router = require("./routers/router");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("dist"));

app.use('/api', router);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
