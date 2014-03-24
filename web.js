var express = require("express");
var app = express();

app.configure(function(){
  app.use(express.bodyParser());
});

app.use(express.logger());
app.use("/", express.static("app"));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});