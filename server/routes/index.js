import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello world!');
});

router.get('/test', function(req, res, next) {
  res.send('Hello test!');
});

export default router;
