var express = require('express');
var router = express.Router();

function viewEntity(req, res){
    return res.render('entities/viewEntity',{
        title:req.params.name + ' | ViewModel',
        entityName:req.params.name,
        style:getTheme(req)
    });
}

function viewEntities(req, res) {
    return res.render('entities/entities', {
        title: "ALL ENTITIES" + " | ViewModel",
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

router.get('/', viewEntities);
router.get('/:name', viewEntity);
router.post('/:name', viewEntity);

module.exports = router;