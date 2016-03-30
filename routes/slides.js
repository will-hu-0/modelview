var express = require('express');
var common = require('./../util/common.js');
var router = express.Router();

function viewSlide(req, res){
    return res.render('slides/viewSlide',{
        title:req.params.name + ' | ViewModel',
        slideName:req.params.name,
        style:common.getTheme(req)
    });
}

function viewSlides(req, res) {
    return res.render('slides/slides', {
        title: "ALL SLIDES" + " | ViewModel",
        style: common.getTheme(req)
    });
}

function editSlide(req, res) {
    return res.render('slides/editSlide', {
        title: "Edit slide " + " | ViewModel",
        style: common.getTheme(req)
    });
}

router.get('/', viewSlides);
router.get('/edit/:name', editSlide);
router.get('/:name', viewSlide);

module.exports = router;