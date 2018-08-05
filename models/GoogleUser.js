const mongoose = require('mongoose');
const { Schema } = mongoose;

const googleUserSchema = new Schema({
  googleId: String
});

mongoose.model('googleUsers', googleUserSchema);
