var express = require('express');
var common = require('./../util/common.js');
var router = express.Router();

function viewTopic(req, res){
    return res.render('topics/viewTopic',{
        title:req.params.name + ' | ViewModel',
        topicName:req.params.name,
        style:common.getTheme(req)
    });
}

function viewTopics(req, res) {
    return res.render('topics/topics', {
        title: "ALL SLIDES" + " | ViewModel",
        style: common.getTheme(req)
    });
}

function editTopic(req, res) {
    return res.render('topics/editTopic', {
        title: "Edit topic " + " | ViewModel",
        style: common.getTheme(req)
    });
}

router.get('/', viewTopics);
router.get('/edit/:name', editTopic);
router.get('/:name', viewTopic);

module.exports = router;