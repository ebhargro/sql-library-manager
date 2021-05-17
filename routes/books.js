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
  const books = await Book.findAll();
  console.log(books);
  res.render('books/all-books', { title: "Library Collection", books});
  }
));
 
//Displays form to create new book
router.get('/new', asyncHandler(async (req, res, next) => {
  res.render('books/new-book', { title: "Create New Book", book: {},});
}));

//Post new book to the database
router.post('/new', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('books/new-book', { title: "Create New Book", book, errors: error.errors});
    } else {
      //handle any errors
      throw error;
    }
  }
}));
//Shows book details form
router.get('/:id', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/update-book', { title: book.title, book});
  }
}));
//Updates book info in the database
router.post('/:id', asyncHandler( async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = new Error();
      err.message = "We don't have this book in our library, sorry! Please try another book. :books:"
      err.status = 404;
      next(err);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/update-book', { title: book.title, book, errors:error.errors});
    } 
    else {
      throw error;
    }
  }
}));
//Deletes a book from the database
router.post('/:id/delete', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  }
  else {
    next();
  }
}));


module.exports = router;
