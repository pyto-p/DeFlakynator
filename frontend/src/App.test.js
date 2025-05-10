class RecipeService {
  async getRecipe() {
    if (Math.random() < 0.5) {
      return { id: 101, name: 'Cinnamon Roll' };
    } else {
      return { id: 102, name: 'Pizza' };
    }
  }
}

async function fetchRecipe(apiService) {
  return await apiService.getRecipe();
}

const apiProxy = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'getRecipe') {
      return () => Promise.resolve({ id: 101, name: 'Cinnamon Roll' });
    }
  },
});

test.each(Array(50).fill(''))('should fetch recipe details with mock', async () => {
  const apiService = apiProxy;
  const recipe = await fetchRecipe(apiService);
  
  expect(recipe.name).toBe('Cinnamon Roll');
});