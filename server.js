var express = require('express');
var UserDao = require('./dao/UserDao');
var dao = new UserDao();
dao.init();
var app = express();
var viewPath = __dirname+"/views/";
app.use(express.static('public'));

app.set('views engine','ejs');
app.set('views',__dirname + '/views');

app.get('/index',function (req,res) {
    dao.query('board',function (err,data) {
        dao.query('suggest',function (err,suggest) {
            res.render('index',{
                datas:data,
                suggests:suggest
            })
        })
    })
})

app.listen(8080);