//加载node的express框架,path静态文件引入
//表单初始化body-parser
//引入mongoose工具
//引入我们建立的mongoDB数据模型passage
//(我们定义的PassageSchema通过mongoose编译生成的数据mongoDB数据模型passage)
var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var passage = require('./models/passage.js')
var _underscore = require('underscore') // _.extend用新对象里的字段替换老的字段
var port = process.env.PORT || 3000//设置端口3000
var app = express();//启动web服务器
//用mongoose连接本地mongoDB，完成数据库连接,数据库名为shumei
mongoose.connect('mongodb://localhost:27017/shumei')
/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */
console.log('MongoDB 连接成功！')

app.locals.moment = require('moment'); // 载入moment模块，格式化日期

app.set('views','./views/pages')//设置视图根目录
app.set('view engine','jade')//设置默认模板引擎
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended:true}))


app.listen(port)//监听3000这个端口

console.log('3000这个端口启动')
//express框架后端匹配到根目录的访问，
//response一个index然后传入参数为替换占位符号
//index
app.get('/',function (req,res) {
	//调用模型，回调中拿到我们的数据passages
	passage.fetch(function(err,passages){
		//如果发生异常，打印出来
		if(err){
			console.log(err)
		}
		//渲染index 传入查询到的passages赋值给index的模板
		res.render('index',{
			title:'黄卿怡的BLOG',
			passages:passages
		})
	})
})

//detail page
app.get('/passage/:id',function (req,res) {
	//匹配到_id的值 通过req.params拿到id
	var id = req.params.id
	//通过这个id来查询，这个方法在schema里面已经定义好
	passage.findById(id,function(err,passage){
		res.render('detail',{
			title:'软通 '+ passage.title,
			passage:passage
		});
	});
})

//admin page 后台录入页面
app.get('/admin/passage',function (req,res) {
	res.render('admin',{
		title:'后台录入页面',
		passage:{
			title:'',
			editor:'',
			summary:'',
			time:'',
			file:'',
			flash:'',
			poster:''
		}
	})
})

//admin update 后台更新页面 匹配到：ID
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){//如果存在这通过moduls拿到数据传入给admin页面
		passage.findById(id,function(err,passage){
			res.render('admin',{
				title:'后台更新页面',
				passage:passage
			})
		})
	}
})


//adminpost---拿到后台录入页post过来的数据
app.post('/admin/passage/new',function(req,res){
	//拿到_id
	var id = req.body.passage._id;
	//拿到对象
	var passageObj = req.body.passage;
	var _passage = null;
	//如果拿到的id与数据库中id匹配 即已经存在
	if(id !=='undefined'){
		//进行更新
		passage.findById(id,function(err,passage){
			if(err){
				console.log(err)
			}
 			//用新对象里的字段替换老的字段
			_passage = _underscore.extend(passage,passageObj);
			_passage.save(function(err,passage){
				if(err){
					console.log(err);
				}
				//重定向
				res.redirect('/passage/'+passage._id);
			});
		});
	}else{ //添加新的数据
		_passage = new passage({
			title:passageObj.title,
			editor:passageObj.editor,
			summary:passageObj.summary,
			time:passageObj.time,
			file:passageObj.file,
			poster:passageObj.poster,
			flash:passageObj.flash
		})

		_passage.save(function(err,passage){
			if(err){
				console.log(err);
			}
			//重定向
			res.redirect('/passage/'+passage._id);
		});
	}
})

//list页面就是将数据库里的数据呈现出来，直接fetch
app.get('/admin/list',function (req,res) {

	passage.fetch(function(err,passages){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'列表页',
			passages:passages
		})
	})
})

//delete 请求的路由
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;//拿到请求id
    if (id) {//存在
        passage.remove({_id: id}, function (err, passage) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
});
