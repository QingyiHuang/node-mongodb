var mongoose = require('mongoose');
//引入模式schema里面的userSchema导出模块
var UserSchema = require('../schemas/user.js');
//利用mongoose封装的函数传入模式编译成模型
var user = mongoose.model('user',UserSchema);
//将user模型构造函数导出
module.exports = user;