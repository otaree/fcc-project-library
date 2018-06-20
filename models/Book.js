const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1
    },
    comments: [String]
});

const Book = mongoose.model("Book", BookSchema);

module.exports = { Book };