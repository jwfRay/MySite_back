var express = require("express");
var bodyParser     =   require("body-parser"); 
var session = require('express-session');
var app = express();
var mysql  = require('mysql'); 
var sess={}; 
setInterval(function() {
    if(sess.user){
    	sess.user=null;
    }
}, 30*60*1000);
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : 'jj292860',       
  port: '3306',                   
  database: 'jwf_pachong', 
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  
connection.connect();
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Credentials", true);  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    if(sess.user){
    	req.session.user=sess.user;
    }
    next();  
});
function newobject(){
	var obj={
		code:'',
		data:{
			list:'',
			total:''
		},
		quanxian:''
	};
	return obj;
}

app.post('/add',function(req,res){
	if(!req.session.user){
		var obj=newobject();
		 obj.code='nologin';
		res.json(obj);
		return;
	}
	addSqlParams=[];
	var str='';
	console.log(req.body);
	for(var a in req.body){
		addSqlParams.push(req.body[a]);
		str+=a+',';
	}
	str=str.substring(0,str.length-1);
	var  addSql = 'INSERT INTO study('+str+') VALUES(?,?,?)';
	console.log(addSql);
	connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         var obj=newobject();
		  obj.code='error';
         //var obj={code:'error'};
		  res.json(obj);
         return;
        }        

       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result); 
       var obj=newobject();
		 obj.code='success';
       res.json(obj);       
       console.log('-----------------------------------------------------------------\n\n');  
	});
});
app.post('/login',function(req,res){
	var state=0;
	if(JSON.stringify(req.body) != "{}"){
		console.log(req.body);
		if(!req.body['username'] && !req.body['username']){
			state=3;
		}else if(!req.body['username']){
			state=1;
		}else if(!req.body['password']){
			state=2;
		}else{
			var sql = 'SELECT * FROM login where username="'+req.body['username']+'" and password="'+req.body['password']+'"';
			console.log(sql);
			connection.query(sql,function (err, result) {
		        if(err){
		          console.log('[SELECT ERROR] - ',err.message);
		          var obj=newobject();
				  obj.code='error';
		          return;
		        }
		 
		       console.log('--------------------------SELECT----------------------------');
		       console.log(result);
		       if(!result.length || result.length==0){
			       	var obj=newobject();
			 		obj.code='mistack';
					state=4;
					res.json(obj);
					return;
				}else{
					state=5;
					req.session.user=req.body['username'];
					sess=req.session;
					console.log(req.session);
					var obj=newobject();
		            obj.code='success';
		            obj.username=req.body['username'];
		            obj.quanxian=result[0].quanxian;
		            res.json(obj);   
					return;
				}
		       console.log('------------------------------------------------------------\n\n');  
			});
			
		}
	}
	switch(state){
		case 1:
			var obj=newobject();
			obj.code='nousername';
			res.json(obj);
			break;
		case 2:
			var obj=newobject();
			obj.code='nopassword';
			res.json(obj);
			break;
		case 3:
			var obj=newobject();
			obj.code='allno';
			res.json(obj);
			break;
	} 
});
app.post('/zhuce',function(req,res){
	var obj={
		username:req.body['username'],
		password:req.body['password'],
		quanxian:req.body['quanxian']
	};
	var arr=[obj.username,obj.password,obj.quanxian];
	var sql='SELECT * FROM login where username="'+obj.username+'"';
	console.log(sql);
	connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          var obj=newobject();
          obj.code='error';
		  res.json(obj);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       if(result.length!=0){
		   var obj=newobject();
	       obj.code='cunzai';
	       res.json(obj);
     	   return;
       }else{
	       	var  addSql = 'INSERT INTO login(username,password,quanxian) VALUES(?,?,?)';
			console.log(addSql);
			connection.query(addSql,arr,function (err, result) {
		        if(err){
		         console.log('[INSERT ERROR] - ',err.message);
		         var obj=newobject();
				  obj.code='error';
		         //var obj={code:'error'};
				  res.json(obj);
		         return;
		        }        

		       console.log('--------------------------INSERT----------------------------');
		       //console.log('INSERT ID:',result.insertId);        
		       console.log('INSERT ID:',result); 
		       var obj=newobject();
			   obj.code='success';
		       res.json(obj);       
		       console.log('-----------------------------------------------------------------\n\n');  
			});
       }
       
       console.log('------------------------------------------------------------\n\n');  
	});
	
});
app.delete('/delete',function(req,res){
	if(!req.session.user){
		var obj=newobject();
		obj.code='nologin';
		res.json(obj);
		return;
	}
	var str='';
	for(var a in req.body){
		//addSqlParams.push(req.body[a]);
		str+=req.body[a];
	}
	var str='DELETE FROM study where id='+str;
	console.log(str);
	connection.query(str,function (err, result) {
        if(err){
          console.log('[DELETE ERROR] - ',err.message);
          var obj=newobject();
          obj.code='error';
		  res.json(obj);
          return;
        }        
 
       console.log('--------------------------DELETE----------------------------');
       console.log('DELETE affectedRows',result.affectedRows);
       var obj=newobject();
       obj.code='success';
       res.json(obj);
       console.log('-----------------------------------------------------------------\n\n');  
	});
});

app.get('/note',function(req,res){
	if(!req.session.user){
		var obj=newobject();
		obj.code='nologin';
		res.json(obj);
		return;
	}
	//console.log(req);
	//if(sess.user){req.session.user=sess.user;}
	console.log(req.session);
	var sql = 'SELECT * FROM study';
	if(JSON.stringify(req.query) != "{}"){
		sql+=' where ';
		for(var a in req.query){
			sql+=a+'="'+req.query[a]+'" or ';
		}
		sql=sql.substr(0,sql.length-3);
	}

	/*for(var a in req.query){
		sql+=req.query[a];
	}
	sql+='"';*/
	console.log(sql);
	connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          var obj=newobject();
          obj.code='error';
		  res.json(obj);
          return;
        }
 
       console.log('--------------------------SELECT----------------------------');
       //console.log(result);
       var obj=newobject();
       obj.code='success';
       obj.data.list=result;
	  obj.data.total=result.length;
       res.json(obj);
       console.log('------------------------------------------------------------\n\n');  
	});
});

app.put('/update',function(req,res){
	if(!req.session.user){
		var obj=newobject();
		obj.code='nologin';
		res.json(obj);
		return;
	}
	var jishu=0;
	var str1='UPDATE study SET ';
	var arr=[];
	var id;
	for(var a in req.body){
		if(a!='id'){
			str1+=a+' = ?,';
			arr.push(req.body[a]);
		}else{
			id=req.body[a];
		}
		
	}
	str1 = str1.substring(0, str1.length - 1);  
	str1+=' where id = '+id;
	console.log(str1);
	connection.query(str1,arr,function (err, result) {
	   if(err){
	         console.log('[UPDATE ERROR] - ',err.message);
	         var obj=newobject();
		obj.code='error';
		  res.json(obj);
	         return;
	   }        
	  console.log('--------------------------UPDATE----------------------------');
	  console.log('UPDATE affectedRows',result.affectedRows);
	   var obj=newobject();
		obj.code='success';
		  res.json(obj);
	  console.log('-----------------------------------------------------------------\n\n');
	});
});

app.get('/loginout',function(req,res){
	sess.user=null;
	 var obj=newobject();
		obj.code='success';
		  res.json(obj);
});

module.exports=app;
