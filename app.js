const express = require('express');
const mongoose = require('mongoose');

// mongoose.connect(keys.mongoURI);

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT);
