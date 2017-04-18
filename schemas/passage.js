var mongoose = require('mongoose');

var passageSchema = new mongoose.Schema({
	title : String,
	editor : String,
	summary : String,
	time : Number,
	file : String,
	poster : String,
	flash : String,
	// meta 更新或录入数据的时间记录
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

//表示每次存储数据之前都先调用这个方法
passageSchema.pre('save',function(next){
	//判断如果是新添加的
	if(this.isNew){
		//创建时间为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		//更新时间为当前时间
		this.meta.updateAt = Date.now();
	}
	//将存储流程走下去，用next();
	next()
})

//静态方法，数据库经过模型编译后这方法才能使用
passageSchema.statics = {
	//fetch方法，取出数据库中所有数据
	fetch:function(cb) {
		return this
			.find({})
			//按更新事件排序
			.sort('meta.updateAt')
			//回调方法
			.exec(cb)	
	},
	//查询单条数据
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = passageSchema