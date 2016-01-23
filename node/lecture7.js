var http = require('http'),
    port = 1234;

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello world (AKA gym)");
  response.end();
}).listen(port);
