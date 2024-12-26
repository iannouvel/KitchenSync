const Recipe = require('../models/Recipe');
const { matchIngredientsToRecipes } = require('../services/openaiService');

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.matchRecipes = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Please provide an array of ingredients' });
    }

    const recipes = await Recipe.find();
    const matches = await matchIngredientsToRecipes(ingredients, recipes);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 