var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

function viewEntity(req, res){
  return res.render('entities/viewEntity',{
    title:req.params.name + ' | ViewModel',
    entityName:req.params.name
  });
}

router.post('/:name', viewEntity);

module.exports = router;
