const mongoose = require('mongoose');
const mongooseErrors = require('mongoose-errors');

const sauceSchema = mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked:  [ "String <userId>" ],
  usersDisliked:  [ "String <userId>" ]
});

sauceSchema.plugin(mongooseErrors);
module.exports = mongoose.model('Sauce', sauceSchema);