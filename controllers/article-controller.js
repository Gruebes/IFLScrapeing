const request = require("request");
const cheerio = require("cheerio");

let Article = require("../models/article.js");
let Note = require("../models/note.js");


let scrape = (req, res) => {
    // First, we grab the body of the html with request
    request("http://www.iflscience.com/", (error, response, html) => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $("div.image-wrap").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").last().attr("title");
            result.link = $(this).children("a").last().attr("href");
            result.image = $(this).children("a").last().children("div.img-wrapper").children("picture").children("source").attr("data-srcset");
            result.date = $(this).next('div.content').children("span.date").text()

            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save((err, doc) => {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);

                }
            });
        });
        res.redirect("/")
    });
}


let getArticles = (req, res) => {
    // Grab every doc in the Articles array
    Article.find({}).sort({ '_id': -1 }).exec((error, doc) => {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            res.render('articles', { article: doc });
        }
    });
};

let save = (req, res) => {

    Article.findOneAndUpdate({
        "_id": req.params._id
    }, { $set: { "saved": req.body.saved } }, (error, doc) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect("/")
        }
    });

};

let remove = (req, res) => {
    Article.findOneAndRemove({ _id: req.params._id }, (error, doc) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect("/")
        }
    })

};

let getSavedArticles = (req, res) => {

    Article.find({ saved: true, }).sort({ '_id': -1 }).exec((error, doc) => {
        if (error) {
            console.log(error);
        } else {
            console.log(doc);

            res.render('articles', { article: doc })
        }
    });

};

let getArticleNotes = (req, res) => {

    Article.findOne({ _id: req.params._id }).populate({ path: "note", options: { sort: { '_id': -1 } } }).exec((error, doc) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`getArticleNotes... ${doc}`);

            res.render('notes', { doc })
        }
    });
}

module.exports = { scrape, getArticles, save, remove, getSavedArticles, getArticleNotes };