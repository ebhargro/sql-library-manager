var express = require('express');
var router = express.Router();
const Book = require('../models/').Book;

//creating asyncHandler function for all routes
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req,res,next);
    } catch (error) {
      next(error);
    }
  } 
}

// /* GET books listing and setting up home route to display full list of books *
router.get('/', asyncHandler(async (req, res, next) => {
  const allBooks = await Book.findAll();
  console.log(allBooks);
  res.render('books/all-books', { title: "Library Collection"});
  }
));
 
module.exports = router;
