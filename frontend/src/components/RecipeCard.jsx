import React from 'react';

const RecipeCard = ({ recipe, matchDetails }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{recipe.title}</div>
        <p className="text-gray-700 text-base mb-2">{recipe.description}</p>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600">
            Match: {matchDetails.matchPercentage}%
          </div>
          {matchDetails.missingIngredients.length > 0 && (
            <div>
              <p className="text-sm font-semibold mt-2">Missing ingredients:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {matchDetails.missingIngredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-sm">
          <p>Prep time: {recipe.prep_time}</p>
          <p>Cook time: {recipe.cook_time}</p>
          <p>Servings: {recipe.servings}</p>
        </div>
      </div>
      
      <div className="px-6 pt-4 pb-2">
        {recipe.cuisine.map((cuisine, index) => (
          <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {cuisine}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecipeCard; 