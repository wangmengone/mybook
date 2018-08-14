var express = require('express');
var router = express.Router();
var connection = require("../db/mysqlOpr.js");

// 1.获取所有的数据
router.get("/", function(req, res, next) {
	connection.query("select * from books", function(err, rows, fileds) {
		if(err) {
			throw err
		}else {
			res.json({
				status: 200,
				results: rows
			})
		}
	})
});

// 2.增加书籍 post
router.post("/", function(req, res, next) {
	// req.body 在这里面存储着post过来的数据
	var name = req.body.name;
	var author = req.body.author;
	var price = req.body.price;
	var press = req.body.press;
	var queryString = `insert into books (bookName, bookAuthor, bookPrice, bookPress) values(${name}, ${author}, ${price}, ${press})`;
	// console.log(queryString);

	connection.query(queryString, function(err, rows, fileds) {
		if(err) {
			throw err
		}else {
			res.json({
				// 1: 成功  0:失败
				status: 1,
				results: "增加成功"
			})
		}
	})
});

// 3.删除书籍 post
// 
router.delete("/:id", function(req, res, next) {
	// req.body 在这里面存储着post过来的数据
	var id = req.params.id;
	var queryString = `delete from books where id=${id}`;
	// console.log(queryString);

	connection.query(queryString, function(err, rows, fileds) {
		if(err) {
			throw err
		}else {
			res.json({
				// 1: 成功  0:失败
				status: 1,
				results: "删除成功"
			})
		}
	})
});

// 4.更新书籍 put
// put有点类似post put请求的数据放到了body里面
// http://127.0.0.1/books/11
router.put("/:id", function(req, res, next) {
	// req.body 在这里面存储着post过来的数据
	var id = req.params.id;
	var name = req.body.name;
	var author = req.body.author;
	var price = req.body.price;
	var press = req.body.press;
	var queryString = `update books set bookName=${name},bookAuthor=${author},bookPrice=${price},bookPress=${press} where id=${id}`;
	console.log(queryString);

	connection.query(queryString, function(err, rows, fileds) {
		if(err) {
			throw err
		}else {
			res.json({
				// 1: 成功  0:失败
				status: 1,
				results: "更新成功"
			})
		}
	})
});

module.exports = router;
