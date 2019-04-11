//==========Imports==========//
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//==========Models==========//
const db = require("./db");

const PORT = 3000;

const app = express();

//==========Middleware==========//
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

