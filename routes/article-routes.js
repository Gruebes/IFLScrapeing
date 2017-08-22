const Article = require('../controllers/article-controller.js');

module.exports = function(app, request) {

    // A GET request to scrape the echojs website
    app.get("/scrape", Article.scrape);

};