let Note = require("../models/note.js");
let Article = require("../models/article.js");

// function to post Note
let createNote = (req, res) => {

    var newNote = new Note(req.body);

    // And save the new note the db
    newNote.save(function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({ "_id": req.params._id }, { $push: { "note": doc._id } })
                // Execute the above query
                .exec(function(err, newDoc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    } else {
                        // Call function to return Article and its notes
                        console.log(`createNotes... ${newDoc}`);
                        res.redirect("back")

                    }
                });
        }
    });
}

// let getAllNotes = (req, res) => {
//     Article.findOne({ _id: req.params._id }).populate({ path: "note", options: { sort: { '_id': -1 } } }).exec((error, doc) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.render('notes', { doc })
//         }
//     });
// }

let removeNote = (req, res) => {
    console.log(req.headers.referer);

    Note.findByIdAndRemove(req.params._id, (error, doc) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect("back");
        }
    });
};




module.exports = { createNote, removeNote };