const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const keys = require('./config/keys');
const newsService = require('./service/newsService');

require('./models/GoogleUser');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

const app = express();

require('./services/cors')(app);
require('./services/cookieSession')(app);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', require('./routes/api'));
app.get('/*', (req, res, next) => {
  res.send('worker demo2');
});

// TODO: should be moved to a separate server that is not affected by user actions
newsService.init();

const PORT = process.env.PORT || 5000;
app.listen(PORT);
