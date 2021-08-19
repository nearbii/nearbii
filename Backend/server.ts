const express = require("express"),
  routes = require("./routes");

const app = express();

app.post(routes.login, function (req, res) {});
