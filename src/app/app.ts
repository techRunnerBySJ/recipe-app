import { Component, signal } from '@angular/core';
import { RecipeBuilderComponent, Ingredient, Recipe } from './recipe-builder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecipeBuilderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('recipe-app');

  availableIngredients: Ingredient[] = [
    { id: '1', name: 'Chicken Breast', category: 'protein', calories: 165 },
  { id: '2', name: 'Salmon Fillet', category: 'protein', calories: 208 },
  { id: '3', name: 'Tofu', category: 'protein', calories: 144 },
  { id: '4', name: 'Rice', category: 'grain', calories: 130 },
  { id: '5', name: 'Quinoa', category: 'grain', calories: 222 },
  { id: '6', name: 'Broccoli', category: 'vegetable', calories: 25 },
  { id: '7', name: 'Bell Peppers', category: 'vegetable', calories: 24 },
  { id: '8', name: 'Spinach', category: 'vegetable', calories: 7 }
  ];

  onRecipeCreated(recipe: Recipe) {
    console.log('Recipe created:', recipe);
  }
}
