//Mongodb的数据库工具类
var client = require('mongodb').MongoClient;
function MongoUtil(url) {
	this.url = 'mongodb://localhost:27017/' + url;	//设置连接的数据库地址
	this.db = null;
};
MongoUtil.prototype.connect = function (callback) {
	var self = this;
	client.connect(this.url, function (err, db) {
		if (err) {
			console.dir(err);	//数据库地址错误
		} else {
			//如何使用db
			self.db = db;		//数据库地址正确，将该数据库绑定至this.db
			callback && callback();
			self.close();		
		}
	});
}
MongoUtil.prototype.close = function () {
	this.db.close();			//断开与服务器的连接
}

MongoUtil.prototype.insertOne = function (collectionName, doc, callback) {
	var that = this;
	this.connect(function () {
		var collections = that.db.collection(collectionName);
		collections.insertOne(doc, callback);
	});
};
//插入一些文档，未测试
MongoUtil.prototype.insertMany = function (collectionName, docs, callback) {
	var that = this;
	this.connect(function () {
		var collections = that.db.collection(collectionName);
		collections.insertMany(docs, function (err, result) {
			if (err) {
				console.dir(err);
			} else {
				callback(result.insertedCount);
			}
		});
	});
};

//找到文档
MongoUtil.prototype.findAll = function (collectionName, docs, callback) {
	var that = this;
	this.connect(function () {
		 // Get the documents collection
		var collection = that.db.collection(collectionName);
		// Find documents
		collection.find(docs).toArray(function(err, docs) {
		    callback&&callback(docs);
		});
	});
};
MongoUtil.prototype.findOne = function (collectionName, doc, options,callback) {
	var that = this;
	this.connect(function () {
		var collection = that.db.collection(collectionName);
		console.log(doc, options);
		collection.findOne(doc, {fields : options}, function (err, doc) {
			callback&&callback(doc);
		});
	})
};
//模糊查询文档

//更新单个文档
MongoUtil.prototype.updateDocument = function (collectionName, doc, updateDoc, callback) {
	var that = this;
	this.connect(function () {
		// Get the document collection
		var collection = that.db.collection(collectionName);
		//doc为需要更新的文档    $set为内置写法  updateDoc更新的内容
		collection.updateOne(doc, { $set: updateDoc }, function (err, result) {
			callback&&callback(result);
		});
	});
};
//删除单个文档
MongoUtil.prototype.removeDocument = function (collectionName, doc, callback) {
	var that = this;
	this.connect(function () {
		var collection = that.db.collection(collectionName);
		collection.deleteOne(doc, function (err, result) {
			callback(result);
		});
	});
};
//findOneAndDelete	参数1：collection的名字，参数2：要查询的文档，参数3：设置查询返回的字段以及确认哪些文档修改如果查询的是多个文档
MongoUtil.prototype.findOneAndDelete = function (collectionName, doc, projection, sort, callback) {
	var that = this;
	this.connect(function () {
		var collection = that.db.collection(collectionName);
		collection.findOneAndDelete(doc, {projection : projection, sort : sort})
		.then(function (result) {
			callback(result);
		});
	});
};
//findOneAndUpdate 参数1：集合的名字，参数2：要更新的文档，参数3：需要更新的部分，参数4：设置返回的字段，参数5：如果是查询的是多个文档，设置排序规则
MongoUtil.prototype.findOneAndUpdate = function (collectionName, doc, setDoc, projection, sort, callback) {
	var that = this;
	this.connect(function () {
		var collection = that.db.collection(collectionName);
		collection.findOneAndUpdate(doc, {$set : setDoc}, {
			projection : projection,
			sort : sort,
			returnOriginal : false,	//false表示返回更新后的文档。默认是true
			upsert : true			//true表示如果没有找到该文档，则进行insert操作
		}, callback);
	})
};

module.exports = new MongoUtil("MongoText");