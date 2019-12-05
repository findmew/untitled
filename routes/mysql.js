var mysql =require('mysql');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
});
//连接数据库connect to database
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    port     : 3306,
    database : 'tool',
});
//连接数据库
connection.connect(function(err){
    if(err){
        res.json({message:err.message});
        console.log(err);
    }else{
        //查询资源目录
        router.get('/selectML',function (req,res) {
            var sql = "select * from `资源目录`";
            connection.query(sql, function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json(result);
            });
        });
        //获取节点id
        router.post('/selectML_id',urlencodedParser,function (req,res) {
            console.log(req.body.text);
            var sql = "select id from `资源目录` where text = ? order by id desc";
            var sqlparam = [req.body.text];
            connection.query(sql,sqlparam,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                if(result.length==0){
                    result = [{"id":-1}];//节点不存在时返回-1
                }
                res.json(result);
            });
        });
        //获取数据说明
        router.post('/selectSM',urlencodedParser,function (req,res) {
            var sql = "select * from `数据说明` where `database` = ? and tablename=?";
            var sqlparam = [req.body.database,req.body.tableName];
            connection.query(sql,sqlparam,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.json(err.message);
                    return;
                }
                //console.log(result);
                res.json(result);
            });
        });
        //根据表id获取字段信息
        router.post('/selectZD',urlencodedParser,function (req,res) {
            console.log(req.body.tableid);
            var sql = "select `序号`,`字段名称`,`字段标识`,`类型及长度`,`是否允许空值`,`计量单位`,`主键`,`外键`,`主键序号` from `字段信息` where tableid = ? order by `序号`";
            var sqlparam = [req.body.tableid];
            connection.query(sql,sqlparam,function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    res.json(err.message);
                    return;
                }
                //console.log(result);
                res.json(result);
            });
        });
        //插入目录
        router.post('/insertML',urlencodedParser,function (req,res) {
            var sql = "insert into `资源目录`(parent,text) values(?,?)";
            var sqlparams = [req.body.parent,req.body.text];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //插入数据说明
        router.post('/insertSM1',urlencodedParser,function (req,res) {
            var sql = "insert into `数据说明`(id,`database`,tablename,tableflag,tableinf,zdinf) values(?,?,?,?,?,?)";
            var sqlparams = [req.body.id*1,req.body.database,req.body.tableName,req.body.TableFlag,req.body.tableInf,req.body.ZDinf];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        router.post('/insertSM2',urlencodedParser,function (req,res) {
            var sql = "insert into `数据说明`(id,`database`,tablename,html) values(?,?,?,?)";
            var sqlparams = [req.body.id,req.body.database,req.body.tableName,req.body.html];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //插入/更新字段信息
        router.post('/insertSM_zd',urlencodedParser,function (req,res) {
            var sql = "insert into `字段信息`(tableid,`序号`,`字段名称`,`字段标识`,`类型及长度`,`是否允许空值`,`计量单位`,`主键`,`外键`,`主键序号`) values(?,?,?,?,?,?,?,?,?,?)" +
                " on duplicate key update `字段名称`=?,`字段标识`=?,`类型及长度`=?,`是否允许空值`=?,`计量单位`=?,`主键`=?,`外键`=?,`主键序号`=?";
            var sqlparams = [req.body.tableid,req.body.序号,req.body.字段名称,req.body.字段标识,req.body.类型及长度,req.body.是否允许空值,req.body.计量单位,req.body.主键,req.body.外键,req.body.主键序号,req.body.字段名称,req.body.字段标识,req.body.类型及长度,req.body.是否允许空值,req.body.计量单位,req.body.主键,req.body.外键,req.body.主键序号];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //修改目录
        router.post('/updateML',urlencodedParser,function (req,res) {
            var sql = "update `资源目录` set parent = ?,text = ? where id = ?";
            var sqlparams = [req.body.parent,req.body.text,req.body.id];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[update error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //修改数据说明
        router.post('/updateSM1',urlencodedParser,function (req,res) {
            var sql = "update `数据说明` set `database` = ?,tablename = ?,tableflag=?,tableinf=?,zdinf=? where `database` = ? and tablename = ?";
            var sqlparams = [req.body.database,req.body.tableName,req.body.TableFlag,req.body.tableInf,req.body.ZDinf,req.body.database,req.body.tableName];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[update error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        router.post('/updateSM2',urlencodedParser,function (req,res) {
            var sql = "update `数据说明` set html = ? where `database` = ? and tablename = ?";
            var sqlparams = [req.body.html,req.body.database,req.body.tableName];
            connection.query(sql, sqlparams,function (err, result) {
                if (err) {
                    console.log('[update error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //删除目录
        router.post('/deleteML',urlencodedParser,function (req,res) {
            var sql = "delete from `资源目录` where id = ?";
            var sqlparams = [req.body.id];
            connection.query(sql,sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
        //删除字段信息
        router.post('/deleteZD',urlencodedParser,function (req,res) {
            var sql = "delete from `字段信息` where tableid = ?";
            var sqlparams = [req.body.tableid];
            connection.query(sql,sqlparams,function (err, result) {
                if (err) {
                    console.log('[insert error] - ', err.message);
                    res.json(err.message);
                    return;
                }
                console.log(result);
                res.json({"message":"ok"});
            });
        });
    }
});
module.exports = router;
