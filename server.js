const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// set exphbs
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static dir
// app.use(express.static("public"));
app.use("/public", express.static(__dirname + '/public'));


// Database configuration with mongoose
mongoose.connect("mongodb://localhost/iflscraper");
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes to use
require("./routes/html-routes.js")(app)
require("./routes/article-routes.js")(app, request);
require("./routes/note-routes.js")(app)

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});