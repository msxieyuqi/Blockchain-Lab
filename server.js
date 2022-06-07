// Node.js搭建本地服务器 & 部署css js 文件

var http = require('http');
var fs = require('fs');
var url = require('url');
var mime = require('./mime.js').types;

var server = http.createServer();
server.listen(7545, function() {
    console.log('port:7545');
})

server.on('request', function(req, res) {
    var urls = url.parse(req.url, true);
    console.log(urls);
    if (urls.pathname == '/') {
        fs.readFile('./index.html', function(err, data) {
            if (!err) {
                res.end(data);
            } else {
                console.log(err);
            }
        })
    } else {
        fs.readFile('.' + req.url, function(err, data) {
            if (!err) {
                res.end(data);
            } else {
                console.log(err);
            }
        })
    }
})
console.log('running');