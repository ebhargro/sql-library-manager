var express = require('express');
var router = express.Router();
const { Book } = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
 (async () => {
     await Book.findAll();
     console.log('TEST');
     res.json();
}
 );
});

module.exports = router;
