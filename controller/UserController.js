var UserDao = require('../dao/UserDao');
exports.login = function (req,res) {
        res.render('login', {})
}
exports.equipmentInfo = function (req,res) {
    if(req.session.username) {
        res.render('equipmentInfo',{});
    }else{
        res.render('login', {})
    }
}
exports.manager = function (req,res) {
    if(req.session.username){
        res.render('manager',{});
    }else {
        res.render('login',{})
    }
}
exports.equipClass = function (req,res) {
    if(req.session.username){
        res.render('equipClass',{})
    }else {
        res.render('login',{})
    }
}
exports.getmsg = function (req,res) {
    var dao = new UserDao();
    dao.init();
    var returnObj = null;
    var router = req.params.id;
    switch (router){
        case 'getBorrowInfo': dao.queryByTerm(['userID'],[req.session.username],'userdetails',function (err,userdetails) {
            returnObj = userdetails;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        case 'getEqupmentall':dao.query('equipmentall',function (err,userdetails) {
            returnObj = userdetails;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        case 'getEqupmentone':dao.queryByTerm(['equipNo','canborrow'],[req.query.equipNo,1],'equipmentone',function (err,equipmentone) {
            returnObj = equipmentone;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        default: console.log('fail');
            break;
    }
}

