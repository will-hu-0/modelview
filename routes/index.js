var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: 'Express',
    style:getTheme(req)
  });
});

function viewEntity(req, res){
  return res.render('entities/viewEntity',{
    title:req.params.name + ' | ViewModel',
    entityName:req.params.name,
    style:getTheme(req)
  });
}

// Get theme from cookie
function getTheme(req) {
  var theme=""
  if (req.cookies.modelviewTheme == "united") theme = "united";
  if (req.cookies.modelviewTheme == "darkly") theme = "darkly";
  return theme;
}

router.post('/:name', viewEntity);

module.exports = router;
