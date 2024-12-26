const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAllRecipes = async () => {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

export const matchRecipes = async (ingredients) => {
  const response = await fetch(`${API_BASE_URL}/recipes/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
  
  if (!response.ok) throw new Error('Failed to match recipes');
  return response.json();
}; 