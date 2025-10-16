/**
 * Unit tests for RecipeBuilderComponent using Jest and Angular 20 signals.
 * Focus: Core functionality, computed properties, recipe emission, and storage integration.
 */

import { RecipeBuilderComponent, Ingredient, Recipe } from './recipe-builder.component';
import { RecipeStorageService } from './recipe-storage.service';
import { TestBed } from '@angular/core/testing';

describe('RecipeBuilderComponent', () => {
  let fixture: any;
  let comp: RecipeBuilderComponent;
  let storageService: RecipeStorageService;

  const SAMPLE_INGREDIENTS: Ingredient[] = [
    { id: '1', name: 'Chicken Breast', category: 'protein', calories: 165 },
    { id: '4', name: 'Rice', category: 'grain', calories: 130 },
    { id: '6', name: 'Broccoli', category: 'vegetable', calories: 25 }
  ];

  beforeEach(async () => {
    localStorage.clear();
    storageService = new RecipeStorageService();

    await TestBed.configureTestingModule({
      imports: [RecipeBuilderComponent]
    }).overrideComponent(RecipeBuilderComponent, {
      set: { template: '<div></div>' }
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeBuilderComponent);
    comp = fixture.componentInstance as RecipeBuilderComponent;
    (comp as any).ingredients.set(SAMPLE_INGREDIENTS);
    comp.savedRecipes.set([]);
    fixture.detectChanges();
  });

  // ------------------------------------------------------------------------------------
  // Initialization Tests
  // ------------------------------------------------------------------------------------
  it('should initialize with provided ingredients and group correctly', () => {
    expect(comp.ingredients().length).toBe(3);
    const grouped = comp.groupedIngredients();
    expect(grouped.protein.length).toBe(1);
    expect(grouped.grain.length).toBe(1);
    expect(grouped.vegetable.length).toBe(1);
  });

  it('should handle empty ingredients list gracefully', () => {
    (comp as any).ingredients.set([]);
    const grouped = comp.groupedIngredients();
    expect(grouped.protein.length).toBe(0);
    expect(grouped.grain.length).toBe(0);
    expect(grouped.vegetable.length).toBe(0);
    expect(comp.totalCalories()).toBe(0);
  });

  // ------------------------------------------------------------------------------------
  // Ingredient Selection
  // ------------------------------------------------------------------------------------
  it('should add and remove ingredients properly', () => {
    comp.addIngredient('1');
    expect(comp.selectedIngredients()).toEqual(['1']);
    expect(comp.isIngredientSelected('1')).toBe(true);

    // Should not duplicate when added again
    comp.addIngredient('1');
    expect(comp.selectedIngredients().length).toBe(1);

    // Add another
    comp.addIngredient('4');
    expect(comp.selectedIngredients().length).toBe(2);

    // Remove one
    comp.removeIngredient('1');
    expect(comp.selectedIngredients()).toEqual(['4']);
    expect(comp.isIngredientSelected('1')).toBe(false);
  });

  // ------------------------------------------------------------------------------------
  // Computed Values
  // ------------------------------------------------------------------------------------
  it('should compute total calories correctly as ingredients change', () => {
    comp.addIngredient('1'); // +165
    comp.addIngredient('4'); // +130 = 295
    expect(comp.totalCalories()).toBe(295);

    comp.removeIngredient('1'); // now only Rice
    expect(comp.totalCalories()).toBe(130);

    comp.clearCurrentRecipe();
    expect(comp.totalCalories()).toBe(0);
  });

  // ------------------------------------------------------------------------------------
  // Validation & Save
  // ------------------------------------------------------------------------------------
  it('should prevent saving when recipe name is empty', () => {
    comp.selectedIngredients.set(['1']);
    comp.recipeName.set('');
    const result = comp.saveRecipe();
    expect(result).toBe(false);
  });

  it('should prevent saving when no ingredients selected', () => {
    comp.recipeName.set('Test Dish');
    comp.selectedIngredients.set([]);
    const result = comp.saveRecipe();
    expect(result).toBe(false);
  });

  // ------------------------------------------------------------------------------------
  // Recipe Saving + Output Emission
  // ------------------------------------------------------------------------------------
  it('should save a valid recipe and emit output event', () => {
    const emitted: Recipe[] = [];
    comp.recipeCreated.subscribe((r: Recipe) => emitted.push(r));

    comp.recipeName.set('Yummy Mix');
    comp.selectedIngredients.set(['1', '4']); // Chicken + Rice

    const saveSpy = jest.spyOn(storageService, 'saveRecipe');
    const getSpy = jest.spyOn(storageService, 'getAllRecipes').mockReturnValue([]);

    // Pass save function explicitly for testing (simulates host call)
    const success = comp.saveRecipe(r => storageService.saveRecipe(r));

    expect(success).toBe(true);
    expect(emitted.length).toBe(1);
    expect(emitted[0].name).toBe('Yummy Mix');
    expect(emitted[0].ingredients).toEqual(['1', '4']);
    expect(emitted[0].totalCalories).toBe(295);

    // Verify storage save was invoked
    expect(saveSpy).toHaveBeenCalledTimes(1);

    // After save, recipe inputs should clear
    expect(comp.recipeName()).toBe('');
    expect(comp.selectedIngredients().length).toBe(0);

    // Clean up spies
    saveSpy.mockRestore();
    getSpy.mockRestore();
  });

  it('should handle localStorage errors gracefully', () => {
    const badFn = () => { throw new Error('Storage failure'); };
    comp.recipeName.set('Oops');
    comp.selectedIngredients.set(['1']);
    const result = comp.saveRecipe(badFn);
    expect(result).toBe(false);
  });

  // ------------------------------------------------------------------------------------
  // Saved Recipes Management
  // ------------------------------------------------------------------------------------
  it('should refresh saved recipes from storage after save', () => {
    const dummyRecipe: Recipe = {
      id: 'r-1',
      name: 'Dummy',
      ingredients: ['1'],
      totalCalories: 165,
      createdDate: new Date(),
    };

    const svc = (comp as any).recipeStorage as RecipeStorageService;
    const getSpy = jest.spyOn(svc, 'getAllRecipes').mockReturnValue([dummyRecipe]);
    const saveSpy = jest.spyOn(svc, 'saveRecipe').mockImplementation(() => {});

    comp.recipeName.set('Dummy');
    comp.selectedIngredients.set(['1']);
    comp.saveRecipe();

    expect(saveSpy).toHaveBeenCalled();
    comp.savedRecipes.set(svc.getAllRecipes());
    expect(comp.savedRecipes().length).toBe(1);

    getSpy.mockRestore();
    saveSpy.mockRestore();
  });

  // ------------------------------------------------------------------------------------
  // Miscellaneous
  // ------------------------------------------------------------------------------------
  it('should clear recipe properly', () => {
    comp.recipeName.set('Something');
    comp.selectedIngredients.set(['1', '4']);
    comp.clearCurrentRecipe();
    expect(comp.recipeName()).toBe('');
    expect(comp.selectedIngredients().length).toBe(0);
  });

  // ------------------------------------------------------------------------------------
  // Reactive Form: Validators & Submit
  // ------------------------------------------------------------------------------------
  it('should have invalid form when name empty and prevent submit', () => {
    const saveSpy = jest.spyOn(comp, 'saveRecipe');
    comp.recipeForm.get('recipeName')?.setValue('');
    comp.selectedIngredients.set(['1']);

    comp.onSubmit();

    expect(comp.recipeForm.invalid).toBe(true);
    expect(saveSpy).not.toHaveBeenCalled();
    saveSpy.mockRestore();
  });

  it('should enforce minlength validator (name < 3 chars)', () => {
    comp.recipeForm.get('recipeName')?.setValue('ab');
    comp.recipeForm.get('recipeName')?.markAsTouched();
    const ctrl = comp.recipeForm.get('recipeName');
    expect(ctrl?.invalid).toBe(true);
    expect(ctrl?.errors?.['minlength']).toBeTruthy();
  });

  it('should submit via onSubmit when form valid and ingredients selected', () => {
    const saveSpy = jest.spyOn(comp, 'saveRecipe').mockReturnValue(true as any);
    comp.recipeForm.get('recipeName')?.setValue('Valid Name');
    comp.selectedIngredients.set(['1']);

    comp.onSubmit();

    expect(comp.recipeForm.valid).toBe(true);
    expect(saveSpy).toHaveBeenCalled();
    saveSpy.mockRestore();
  });

  it('should reset form control when clearing current recipe', () => {
    comp.recipeForm.get('recipeName')?.setValue('To be cleared');
    comp.selectedIngredients.set(['1']);
    comp.clearCurrentRecipe();

    expect(comp.recipeForm.get('recipeName')?.value).toBe('');
    expect(comp.recipeName()).toBe('');
  });
});
