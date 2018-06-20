/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const _ = require("lodash");
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const { Book } = require("../models/Book");

module.exports = function (app) {

  app.route('/api/books')
    .get( async (req, res) => {
      //response will be array of book objects

      try {
        const books = await Book.find();
        
        const parsedBooks = books.map(book => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
        });
        res.json(parsedBooks);
      } catch (e) {
        res.status(400).json();
      }

      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post( async (req, res) => {
      const title = req.body.title;

      try {
        if (Object.keys(req.body).length === 0 || title.trim() === "") throw "Please provide title";

        const newBook = new Book({ title });

        const book = await newBook.save();

        res.json({
          title: book.title,
          _id: book._id
        });
      } catch (e) {
        if (e === "Please provide title") {
          res.status(400).json({
            failed: e
          })
        } else {
          res.status(400).json({});
        }
      }
      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'

      try {
        await Book.deleteMany({});
        res.json({
          success: "complete delete successful"
        })
      } catch (e) {
        res.status(400).json();
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      const bookid = req.params.id;

      try {

        if (!ObjectId.isValid(bookid)) throw `${bookid} is invalid`;

        const book = await Book.findById(bookid);

        if (!book) throw `${bookid} is invalid`;

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (e) {
        if (e === `${bookid} is invalid`) {
          res.status(400).json({
            failed: e
          });
        } else {
          res.status(400).json();
        }
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;

      try {
        if (!ObjectId.isValid(bookid)) throw `${bookid} is invalid`;
        if (comment.trim() === "") throw "please provide comment";

        const updateBook = await Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true });

        if (!updateBook) throw `${bookid} not found`;

        res.json({
          _id: updateBook._id,
          title: updateBook.title,
          comments: updateBook.comments
        });

      } catch (e) {
        if ([`${bookid} is invalid`, "please provide comment", `${bookid} not found`].includes(e)) {
          res.status(400).json({
            failed: e
          });
        } else {
          res.status(400).json({});
        }
      }
      //json res format same as .get
    })
    
    .delete(async (req, res) => {
      const bookid = req.params.id;

      try {

        if (!ObjectId.isValid(bookid)) throw `${bookid} is invalid`;

        const book = await Book.findByIdAndRemove(bookid);

        if (!book) throw `${bookid} not found`;

        res.json({
          success: "delete successful"
        });
      } catch (e) {
        if (e === `${bookid} is invalid`) {
          res.status(400).json({ failed: e });
        } else if (e === `${bookid} not found`) {
          res.status(400).json({ failed: e });
        } else {
          res.status(400).json();
        }
      }
      //if successful response will be 'delete successful'
    });
  
};
