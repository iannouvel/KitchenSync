const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: String,
  description: String,
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  prep_time: String,
  cook_time: String,
  total_time: String,
  servings: String,
  cuisine: [String],
  category: [String],
  author: String,
  date_published: Date
});

module.exports = mongoose.model('Recipe', recipeSchema); 