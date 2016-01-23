var http = require('http'),
    port = 1234;

http.createServer(function(request, response) {
  var url = request.url;
  var tempStr = "";
  for (var i = 2; i<url.length; i++) {
    tempStr += url[i];
  }
  var tempArray = tempStr.split("&");
  var tempArray2 = tempArray.map(function(thing) {return thing.split("=");});
  var dat = {};
  for (var i = 0; i<tempArray2.length; i++) {
    dat[tempArray2[i][0]] = tempArray2[i][1];
  }

  var respString = "";
  if(dat.lifter && (dat["supa"] != "")) {
    respString = "Hell yeah, " + dat.fname + "! We're totally going to get swole together doing some " + dat.supa + "!";
  }
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello world (AKA, my gym)\n" + respString + dat);
  response.end();
  console.log(dat);
}).listen(port);
console.log('Server listening on port ' + port);