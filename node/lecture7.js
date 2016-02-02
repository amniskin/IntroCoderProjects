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
  } else if(dat.lifter) {
    respString = "That's cool, " + dat.fname + ". I'm a lifter too. Hit me up on Myspace. I post like 7 pictures a day during my workouts, which take up my entire day. It's pure motivation, bro!";
  } else {
    respString = dat.lname + "! You need to get in that gym, bro! How are people gonna know about your gains if you don't post pictures all the time on Instagram?!";
  }
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello world (AKA, my gym)\n" + respString);
  response.end();
}).listen(port);
console.log('Server listening on port ' + port);
