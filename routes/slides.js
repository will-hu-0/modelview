var express = require('express');
var router = express.Router();

function viewSlide(req, res){
    return res.render('slides/viewSlide',{
        title:req.params.name + ' | ViewModel',
        slideName:req.params.name,
        style:getTheme(req)
    });
}

function viewSlides(req, res) {
    return res.render('slides/slides', {
        title: "ALL SLIDES" + " | ViewModel",
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

router.get('/', viewSlides);
router.get('/:name', viewSlide);

module.exports = router;