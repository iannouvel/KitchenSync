const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function matchIngredientsToRecipes(userIngredients, recipes) {
  try {
    const prompt = `
    Given these user ingredients: ${JSON.stringify(userIngredients)}
    And these recipes: ${JSON.stringify(recipes)}
    
    Return a JSON array of recipe IDs sorted by how well they match the user's ingredients.
    For each recipe include:
    1. recipeId
    2. matchPercentage (what % of required ingredients the user has)
    3. missingIngredients (array of ingredients the user needs to buy)
    
    Only include recipes where the user has at least 30% of ingredients.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that matches recipes to available ingredients"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

module.exports = {
  matchIngredientsToRecipes
}; 