import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';
import { getAllRecipes, matchRecipes } from './services/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      }
    };

    fetchRecipes();
  }, []);

  const handleIngredientSubmit = async (ingredients) => {
    setLoading(true);
    setError(null);
    try {
      const matchedRecipes = await matchRecipes(ingredients);
      setMatches(matchedRecipes);
    } catch (err) {
      setError('Failed to match recipes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Recipe Matcher
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <IngredientInput onSubmit={handleIngredientSubmit} />
        
        {error && (
          <div className="text-red-600 text-center mt-4">{error}</div>
        )}
        
        {loading ? (
          <div className="text-center mt-8">Loading...</div>
        ) : (
          <RecipeList recipes={recipes} matches={matches} />
        )}
      </main>
    </div>
  );
}

export default App; 