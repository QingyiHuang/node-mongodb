###这是一个利用nodejs 和 mongoDB搭建的网站，
####主页localhost:3000
####详情页点击即可进入，mongodb我还没有自己按阿拉伯数字编码
####list页localhost:3000/admin/list
####后台录入页localhost:3000/admin/passage
mongoDB实例化
利用mongoose建模

	var Passage=require('./models/passage')
	
	var passage = new Passage({
	   title:'ssd'
	   editor:'hqy'
	   year:'2016'
	})
	
	passage.save(function(err){//调用save方法存储数据
	   if (err)
	   {return handleError(err)}
	})

####数据库操纵
	app.get('/',function(req,res){
		Passage
  			.find({})//批量查询
			.exec(function(err,movies){
			
				res.render('index',{
					title:'自制网页'
					passages:passages
				})		
			})
	})

	app.get('/',function(req,res){
		Passage
  			.findOne({_id:id})//单条查询
			.exec(function(err,movies){
			
				res.render('index',{
					title:'自制网页'
					passages:passages
				})		
			})
	})

项目下的schemas是声明

删除用了jquery ajax异步请求

##bowerrc指定安装到依赖项目目录
本项目已经不再需要使用bower，因为已经把静态文件放入了public
使用的时候直接
	npm install 就行了，直接加载项目依赖
如果缺少文件
    bower install
如果没有bower
    npm install bower