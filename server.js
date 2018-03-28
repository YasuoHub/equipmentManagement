var express = require('express');
var session = require('express-session');
//获得body-parser模块
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var UserDao = require('./dao/UserDao');
var userController = require('./controller/UserController');
var dao = new UserDao();
dao.init();
var app = express();
//配置session
app.use(session({
    secret: 'a secret',   // 可以随便写。 一个 String 类型的字符串，作为服务器端生成 session 的签名
    name:'session_id',//保存在本地cookie的一个名字 默认connect.sid  可以不设置
    resave: false,   //强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false
    saveUninitialized: true,   //强制将未初始化的 session 存储。 默认值是true  建议设置成true
    cookie: {
        maxAge:50000 //过期时间

    },	//设置过期时间比如是30分钟，只要浏览页面，30分钟没有操作的话在过期
    rolling:true //在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认：false)
}));
var viewPath = __dirname+"/views/";
app.use(express.static('public'));

app.set('views engine','ejs');
app.set('views',__dirname + '/views');

app.get('/index',function (req,res) {
    dao.query('board',function (err,data) {
        dao.query('suggest',function (err,suggest) {
            dao.query('treaty',function (err,treaty) {
                dao.queryByTerm(['stuID'],[req.session.username],'users',function (err,users) {
                    res.render('index',{
                        datas:data,
                        suggests:suggest,
                        treatys:treaty,
                        user:users
                    });
                    console.log(users)
                })
            })
        })
    })
})

app.get('/equipmentInfo',userController.equipmentInfo);

app.get('/login',userController.login);
app.post('/login',urlencodedParser,function (req,res) {
    var username= req.body.username;
    var passwd  = req.body.passwd;
    var powerId = req.body.powerId;
    var isRem = req.body.isRem;
    console.log(req.body);
    req.session.username=username;

    dao.queryByTerm(['stuID'],[username],'users',function (err,data) {
        console.log(data[0].power);
        if(data.length!=0){
            if(data[0].stuPassWord!=passwd){
                res.end('3');//密码错误
            }
        }else{
            res.end('2');//账号错误
        }
        if(isRem){
            req.session.cookie.username =username;
            req.session.cookie.passwd   =passwd;
        }
        console.log(req.session);
        if(powerId=='1' && data[0].power=='1'){
            res.end('1');//权限为管理员
        }else if(powerId=='0' && data[0].power=='0') {
            res.end('0');//权限为普通用户
        }else{
            res.end('-1');//没有权限
        }
    });

});

app.get('/manager',userController.manager);

app.get('/equipClass',userController.equipClass);

//动态路由
app.get('/getmsg/:id',userController.getmsg);

app.post('/reserveBorrow',urlencodedParser,function (req,res) {
    console.log(req.body);
    /*dao.insert(['userID','userName','equipID','equipName'],'userdetails',function (err,data) {

    })*/
})

app.listen(8080);