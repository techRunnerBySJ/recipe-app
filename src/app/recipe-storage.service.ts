import { Injectable } from '@angular/core';
import { Recipe } from './recipe-builder.component';

@Injectable({
  providedIn: 'root',
})
export class RecipeStorageService {
  private readonly STORAGE_KEY = 'saved-recipes';

  /**
   * Method to save a recipe to localStorage under the STORAGE_KEY and handle errors
   * @param recipe Recipe to save
   */
  saveRecipe(recipe: Recipe): void {
    try {
      const existing = this.getAllRecipes();
      const next = [recipe, ...existing];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      throw err;
    }
  }

  /**
   * Method to get all saved recipes from localStorage, returning empty array if none or error
   * @returns All saved recipes from localStorage, or empty array if none or error
   */
  getAllRecipes(): Recipe[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((p: unknown) => this.toRecipe(p))
        .filter((r): r is Recipe => r != null);
    } catch (err) {
      return [];
    }
  }

  /**
   * Runtime-narrow unknown to Recipe with minimal structural checks.
   */
  private toRecipe(value: unknown): Recipe | null {
    if (!value || typeof value !== 'object') return null;
    const obj = value as Record<string, unknown>;
    const id = typeof obj['id'] === 'string' ? obj['id'] : null;
    const name = typeof obj['name'] === 'string' ? obj['name'] : null;
    const ingredients = Array.isArray(obj['ingredients']) && obj['ingredients'].every((x) => typeof x === 'string')
      ? (obj['ingredients'] as string[])
      : null;
    const totalCalories = typeof obj['totalCalories'] === 'number' ? obj['totalCalories'] : null;
    const createdRaw = obj['createdDate'];
    const createdDate = createdRaw instanceof Date
      ? createdRaw
      : typeof createdRaw === 'string' || typeof createdRaw === 'number'
        ? new Date(createdRaw)
        : new Date();

    if (!id || !name || !ingredients || totalCalories === null) return null;
    return { id, name, ingredients, totalCalories, createdDate } satisfies Recipe;
  }

  /**
   * Method to delete a recipe by ID from localStorage and handle errors
   * @param recipeId ID of recipe to delete
   */
  deleteRecipe(recipeId: string): void {
    try {
      const existing = this.getAllRecipes();
      const next = existing.filter((r) => r.id !== recipeId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      throw err;
    }
  }
}
