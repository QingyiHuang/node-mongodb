var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');//专门为密码hash做的算法
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({//mongoose对象，
	//通过mongoose.Schema这个对象接口，在对象里面描述模型的文档结构
	//以及数据类型
	//生成的模式复制给userschema
	//创建name 和 password 定义uniqueString
	name:{
		unique: true,
		type:String
	},
	password:{
		unique: true,
		type:String
	},
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
UserSchema.pre('save',function(next){
	var user = this;
	//判断如果是新添加的
	if(this.isNew){
		//创建时间为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		//更新时间为当前时间
		this.meta.updateAt = Date.now();
	}

//将密码和随机的盐混合加密，拿到密码
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err){
			return next(err)
		}
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err){
				return next(err)
			}
			user.password = hash;
			next();
		})
	});//生成随机盐
})

//模型的实例方法
UserSchema.methods = {
	//对比密码的方法
	comparePassword:function(_password,callback){
		//用bcrypt自带方法比较//拿res.body.password和数据库里的password
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){s
				return callback(err)
			}
			//没错的话calback(err,isMactch)
			callback(null,isMatch)
		})
	}
}




//静态方法，数据库经过模型编译后这方法才能使用
UserSchema.statics = {
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

module.exports = UserSchema