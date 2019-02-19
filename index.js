"use strict";

const express = require("express");
const jsonParser = require("body-parser").json;
const routes = require("./router");
const logger = require("morgan");
const cors = require('cors');
const {handle404Errors, handleErrors} = require("./helpers/error_handlers");
const {databaseSetUp} = require("./helpers/database_setup");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.Promise = global.Promise;
let port = process.env.PORT || 8081;
app.use(logger("dev"));
app.use(jsonParser());
app.use(cors())

databaseSetUp();
if (process.env.NODE_ENV === 'testing') {
    port = process.env.TEST_PORT
  }

app.use("/v1", routes);

// catch 404 error and forward to error handler
app.use(handle404Errors());

// Error Handler
app.use(handleErrors());


app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
