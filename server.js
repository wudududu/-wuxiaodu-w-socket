// let baseConfig = require('./config');
// let WSocket = require('./index');
// console.warn(baseConfig, WSocket);
let ws = require("nodejs-websocket");
var server = ws.createServer(function (conn) {
  console.log("New connection")
  conn.on("text", function (str) {
      console.log("Received "+str)
      conn.sendText(str.toUpperCase()+"!!!")
  })
  conn.on("close", function (code, reason) {
      console.log("Connection closed")
  })
  conn.on("error", (err) => {
    console.log(err)
  })
}).listen(8001);

console.log(server);