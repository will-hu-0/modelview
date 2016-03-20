var express = require('express');
var router = express.Router();

function viewEntity(req, res){
    return res.render('entities/viewEntity',{
        title:req.params.name + ' | ViewModel',
        entityName:req.params.name
    });
}

router.get('/:name', viewEntity);
router.post('/:name', viewEntity);

module.exports = router;