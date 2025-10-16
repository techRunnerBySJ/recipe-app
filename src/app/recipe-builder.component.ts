import { Component, Input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { RecipeStorageService } from './recipe-storage.service';

export type Ingredient = {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'grain';
  calories: number;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  totalCalories: number;
  createdDate: Date;
};

@Component({
  selector: 'app-recipe-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-builder.component.html',
  styleUrls: ['./recipe-builder.component.css'],
})
export class RecipeBuilderComponent {
  ingredients = signal<Ingredient[]>([]);
  recipeCreated = output<Recipe>();

  recipeName = signal('');
  selectedIngredients = signal<string[]>([]);

  savedRecipes = signal<Recipe[]>([]);

  @Input('ingredients')
  private recipeStorage = inject(RecipeStorageService);

  constructor() {
    this.savedRecipes.set(this.recipeStorage.getAllRecipes());
  }

  set ingredientsInput(value: Ingredient[] | null | undefined) {
    this.ingredients.set(value ?? []);
  }

  /**
   * Method to compute total calories of selected ingredients (computed) and return 0 if none selected
   */
  totalCalories = computed(() => {
    const selected = this.selectedIngredients();
    if (!selected || selected.length === 0) return 0;
    const all = this.ingredients();
    if (!all) return 0;
    return selected.reduce((sum, id) => {
      const ing = all.find((i) => i.id === id);
      return sum + (ing ? ing.calories : 0);
    }, 0);
  });

  /**
   * Method to find ingredient by ID and return undefined if not found
   * @param id ID of ingredient to find
   * @returns 
   */
  getIngredientById(id: string): Ingredient | undefined {
    const all = this.ingredients();
    if (!all) return undefined;
    return all.find((ing) => ing.id === id);
  }

  /**
   * Method to get ingredient name by ID, or 'Unknown' if not found
   * @param id ID of ingredient
   * @returns 
   */
  getIngredientName(id: string): string {
    return this.getIngredientById(id)?.name ?? 'Unknown';
  }

  /**
   * Method to get ingredient calories by ID, or 0 if not found
   * @param id ID of ingredient
   * @returns 
   */
  getIngredientCalories(id: string): number {
    return this.getIngredientById(id)?.calories ?? 0;
  }

  /**
   * Method to group ingredients by category for display (computed) and return empty arrays if none
   */
  groupedIngredients = computed(() => {
    const all = this.ingredients() ?? [];
    return {
      protein: all.filter((i) => i.category === 'protein'),
      vegetable: all.filter((i) => i.category === 'vegetable'),
      grain: all.filter((i) => i.category === 'grain'),
    } as Record<'protein' | 'vegetable' | 'grain', Ingredient[]>;
  });

  /**
   * Method to check if an ingredient is selected (computed)
   * @param ingredientId ID of ingredient to check
   * @returns 
   */
  isIngredientSelected(ingredientId: string): boolean {
    return this.selectedIngredients().includes(ingredientId);
  }

  /**
   * Method to add an ingredient to the selected list
   * @param ingredientId ID of ingredient to add
   */
  addIngredient(ingredientId: string) {
    const current = this.selectedIngredients();
    if (!current.includes(ingredientId)) {
      this.selectedIngredients.set([...current, ingredientId]);
    }
  }

  /**
   * Method to remove an ingredient from the selected list
   * @param ingredientId ID of ingredient to remove
   */
  removeIngredient(ingredientId: string) {
    const current = this.selectedIngredients();
    this.selectedIngredients.set(current.filter((id) => id !== ingredientId));
  }

    /**
     *  Method to clear current recipe inputs (name & selected ingredients)
     * - does not affect saved recipes
     */

  clearCurrentRecipe() {
    this.recipeName.set('');
    this.selectedIngredients.set([]);
  }

  /**
   * Method to save the current recipe if valid and emit event to parent component and clear inputs
   * validation rules:
   * - name must be non-empty
   * - at least one ingredient must be selected
   * If valid:
   * - create recipe object with id & createdDate
   * - save to localStorage via service (service will be called by host / injected - for the assessment we will show usage)
   * - emit recipeCreated event with new recipe
   * - clear current inputs
   * If invalid or error occurs, do nothing and return false
   * @param recipeStorageSaveFn Optional function to save recipe (for testability); if not supplied, uses internal service
   * @returns true if saved successfully, false otherwise
   */
  saveRecipe(recipeStorageSaveFn?: (r: Recipe) => void) {
    const name = this.recipeName().trim();
    const ingredients = this.selectedIngredients();
    if (!name) return false;
    if (!ingredients || ingredients.length === 0) return false;

    const recipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name,
      ingredients: [...ingredients],
      totalCalories: this.totalCalories(),
      createdDate: new Date(),
    };
    
    try {
      if (recipeStorageSaveFn) {
        recipeStorageSaveFn(recipe);
      } else {
        this.recipeStorage.saveRecipe(recipe);
        this.savedRecipes.set(this.recipeStorage.getAllRecipes());
      }
      this.recipeCreated.emit(recipe);
      this.clearCurrentRecipe();
      return true;
    } catch (err) {
      return false;
    }
  }
}
