var express = require('express');
var router = express.Router();

function viewEntity(req, res){
    return res.render('entities/viewEntity',{
        title:req.params.name + ' | ViewModel',
        entityName:req.params.name
    });
}

function viewEntities(req, res) {
    return res.render('entities/entities', {
        title: "ALL ENTITIES" + " | ViewModel"
    });
}

router.get('/', viewEntities);
router.get('/:name', viewEntity);
router.post('/:name', viewEntity);

module.exports = router;