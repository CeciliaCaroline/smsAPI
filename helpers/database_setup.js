'use strict';
const mongoose = require("mongoose");
const dbConfig = require("../database.config");

mongoose.Promise = global.Promise;

module.exports.databaseSetUp = () => {
let DATABASE_URL = dbConfig.url;

if (process.env.NODE_ENV === "testing") {
  DATABASE_URL = dbConfig.testUrl;
}

// Connecting to the database
mongoose
  .connect(
    DATABASE_URL,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
}