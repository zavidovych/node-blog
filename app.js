if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-2.0'][0]['credentials'];
}
else{
  var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"db"
  }
}

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

app.configure(function() {
    app.set('port', process.env.VMC_APP_PORT || process.env.PORT || 3000);
    app.set('host', process.env.VCAP_APP_HOST || process.env.IP || process.env.HOST || 'localhost');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

var articleProvider = new ArticleProvider(app.get('host'), 27017),
    routes = require('./routes')(articleProvider);

app.get('/', routes.index);

app.get('/blog/new', routes.get_new);

app.post('/blog/new', routes.post_new);

app.get('/blog/:id', routes.get_by_id);

app.post('/blog/addComment', routes.add_comment);

app.get('*', routes.not_found);

http.createServer(app).listen(app.get('port'), function(){
    console.log(mongourl);
  console.log("Express server listening on port " + app.get('port') + ", host " + app.get('host'));
});
