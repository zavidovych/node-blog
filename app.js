/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
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

var articleProvider = new ArticleProvider('localhost', 27017),
    routes = require('./routes')(articleProvider);

app.get('/users', user.list);

app.get('/', routes.index);

app.get('/blog/new', routes.get_new);

app.post('/blog/new', routes.post_new);

app.get('/blog/:id', routes.get_by_id);

app.post('/blog/addComment', routes.add_comment);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
