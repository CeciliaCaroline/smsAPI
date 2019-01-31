'use strict';

const express = require('express');
const jsonParser = require("body-parser").json;
const routes = require('./router');
const logger = require('morgan');
const mongoose = require("mongoose");
const dbConfig = require("./database.config")

const app = express();

mongoose.Promise = global.Promise;


app.use(logger('dev'));
app.use(jsonParser());

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// mongoose.connect(dbConfig.url, { useNewUrlParser: true });

// const db = mongoose.connection;
// db.on("error", err => {
//   console.log("Connection error", err);
// });

// db.once("open", () => {
//   console.log("Connection successful");
// });

app.use("/v1", routes)

// catch 404 error and forward to error handler
app.use((req, res, next)=> {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);

});

// Error Handler
app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });

});

const port = 8081;
app.listen(port, ()=> {
    console.log(`App is listening on port ${port}`)
})