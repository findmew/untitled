var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
/* get the instruction of database*/
router.get('/dataInstruction',function(req,res,next){
  res.render('dataInstruction');
});
/* get the word instruction of database*/
router.get('/word',function(req,res,next){
  res.render('word');
});
router.get('/UEditor',function (req,res,next) {
  res.render('UEditor');
});
module.exports = router;
