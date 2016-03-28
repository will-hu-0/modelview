var express = require('express');
var common = require('./../util/common.js');
var router = express.Router();

function viewEntity(req, res){
    return res.render('entities/viewEntity',{
        title:req.params.name + ' | ViewModel',
        entityName:req.params.name,
        style:common.getTheme(req)
    });
}

function viewEntities(req, res) {
    return res.render('entities/entities', {
        title: "ALL ENTITIES" + " | ViewModel",
        style:common.getTheme(req)
    });
}

router.get('/', viewEntities);
router.get('/:name', viewEntity);
router.post('/:name', viewEntity);

module.exports = router;