const express = require('express');
const mongoose = require('mongoose');

// mongoose.connect(keys.mongoURI);

const app = express();

require('./routes/index.js')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
