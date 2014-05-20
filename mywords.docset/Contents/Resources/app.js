var express = require('express'),
    hbs = require('handlebars'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    app = express();

// middleware
app.use(bodyParser());

var router = express.Router(); 

app.set('views', __dirname + '/Documents');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.get('/', routes.index);
app.get('/add', routes.add);
app.get('/page/:id', routes.page);
app.post('/post', routes.post);

app.listen(3000);
