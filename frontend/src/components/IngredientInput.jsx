import React, { useState } from 'react';

const IngredientInput = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientList = ingredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);
    onSubmit(ingredientList);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label 
          htmlFor="ingredients" 
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Enter your ingredients (comma-separated):
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="e.g. chicken, rice, onions"
          rows="4"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Find Recipes
      </button>
    </form>
  );
};

export default IngredientInput; 