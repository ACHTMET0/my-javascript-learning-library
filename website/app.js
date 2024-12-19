var http = require('http');
const routes = require("./routes");

const { request } = require('https');
const { parse } = require('path');
const routeHandler = require('./routes');


var server = http.createServer(routeHandler);


server.listen(3000);

console.log("node.js server at port 3000");