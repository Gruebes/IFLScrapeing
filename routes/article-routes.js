const Article = require('../controllers/article-controller.js');

module.exports = function(app, request) {

    // A GET request to scrape the echojs website
    app.get("/scrape", Article.scrape);

    app.get("/", Article.getArticles);

    app.post("/article/save/:_id", Article.save);

    app.post("/article/remove/:_id", Article.remove);

    app.get("/articles/saved", Article.getSavedArticles);

    app.get('/notes/:_id?', Article.getArticleNotes);

};