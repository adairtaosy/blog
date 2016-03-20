var express = require('express'),
    routes = require('./routes'),
    favicon = require('express-favicon');

var app = express();

//configuration
app.use(favicon(__dirname + '/public/favicon.ico'));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
app.use(bodyParser());
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({error: 'Something failed!'});
    } else {
        next(err);
    }
}
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('error', {error: err});
}

app.get('/', routes.index);
app.get('*', routes.index);

app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
