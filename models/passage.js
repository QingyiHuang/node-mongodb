var mongoose = require('mongoose');
//引入模式schema里面的PassageSchema导出模块
var passageSchema = require('../schemas/passage.js');
//利用mongoose封装的函数传入模式编译成模型
var passage = mongoose.model('passage',passageSchema);
//将passage模型构造函数导出
module.exports = passage;