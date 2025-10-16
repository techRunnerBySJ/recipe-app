import { RecipeStorageService } from './recipe-storage.service';
import { Recipe } from './recipe-builder.component';

describe('RecipeStorageService', () => {
  let svc: RecipeStorageService;
  const KEY = 'saved-recipes';

  beforeEach(() => {
    localStorage.clear();
    svc = new RecipeStorageService();
  });

  // ------------------------------------------------------------------------------------
  // Storage Tests
  // ------------------------------------------------------------------------------------
  it('should save and load a recipe', () => {
    const recipe: Recipe = {
      id: 'r1',
      name: 'Test',
      ingredients: ['1', '2'],
      totalCalories: 300,
      createdDate: new Date(),
    };

    svc.saveRecipe(recipe);
    const loaded = svc.getAllRecipes();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('r1');
  });

  // ------------------------------------------------------------------------------------
  // Deletion Tests
  // ------------------------------------------------------------------------------------
  it('should delete a recipe', () => {
    const recipe: Recipe = {
      id: 'r1',
      name: 'Test',
      ingredients: [],
      totalCalories: 0,
      createdDate: new Date(),
    };
    svc.saveRecipe(recipe);
    expect(svc.getAllRecipes().length).toBe(1);
    svc.deleteRecipe('r1');
    expect(svc.getAllRecipes().length).toBe(0);
  });

  // ------------------------------------------------------------------------------------
  // Invalid JSON Tests
  // ------------------------------------------------------------------------------------
  it('getAllRecipes returns [] on invalid json', () => {
    localStorage.setItem(KEY, 'not-json');
    const list = svc.getAllRecipes();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });
});
