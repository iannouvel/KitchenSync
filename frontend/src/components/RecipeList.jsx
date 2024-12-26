import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, matches }) => {
  if (!recipes || recipes.length === 0) {
    return <div className="text-center mt-8">No recipes found</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {matches.map((match) => {
        const recipe = recipes.find(r => r._id === match.recipeId);
        if (!recipe) return null;
        
        return (
          <RecipeCard 
            key={recipe._id} 
            recipe={recipe} 
            matchDetails={match}
          />
        );
      })}
    </div>
  );
};

export default RecipeList; 