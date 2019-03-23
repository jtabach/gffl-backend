const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const keys = require('./config/keys');
const newsService = require('./service/newsService');
const clientErrorHandler = require('./services/clientErrorHandler');
const logErrors = require('./services/logErrors');

require('./models/GoogleUser');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./services/cors')(app);
require('./services/cookieSession')(app);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.options('*', cors());
app.use('/api', require('./routes/api'));
app.use(logErrors);
app.use(clientErrorHandler);
app.get('/*', (req, res, next) => {
  res.send('worker demo2');
});

newsService.init(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT);
