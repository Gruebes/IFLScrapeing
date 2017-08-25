const Note = require('../controllers/note-controller.js');


module.exports = function(app) {

    app.post("/notes/create/:_id", Note.createNote);

};