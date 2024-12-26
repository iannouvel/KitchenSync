import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://kitchensync-api.onrender.com/api/recipes')
      .then(response => response.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch recipes');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>KitchenSync</h1>
        <p>Discover Yotam Ottolenghi's Recipes</p>
      </header>
      <main>
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              <div className="recipe-meta">
                <span>Prep time: {recipe.prep_time}</span>
                <span>Cook time: {recipe.cook_time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App; 