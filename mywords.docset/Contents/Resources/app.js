var express = require('express'),
    hbs = require('handlebars'),
    routes = require('./routes'),
    app = express();

app.set('views', __dirname + '/Documents');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);
app.get('/add', routes.add);
app.get('/page/:id', routes.page);

app.listen(3000);
