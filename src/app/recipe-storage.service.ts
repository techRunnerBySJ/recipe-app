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
      const parsed = JSON.parse(raw) as any[];
      return parsed.map((p) => ({
        ...p,
        createdDate: p.createdDate ? new Date(p.createdDate) : new Date(),
      }));
    } catch (err) {
      return [];
    }
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
