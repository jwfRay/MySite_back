var express=require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var routes=require('./routes');
var bodyParser = require('body-parser');  
var app =express();
app.set('trust proxy', 1);
var options={     
  host     : '123.206.212.138',       
  user     : 'root',              
  password : 'shirt123',       
  port: '3306',                   
  database: 'jwflj', 
};
app.use(cookieParser('name'));
app.use(session({
	secret:'name',
	cookie: {
		secret: true,
		expires: false
	},
	resave: true,
saveUninitialized: true
}));
//app.use(express.favicon());
app.use('/', routes);


var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})