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

  // Sample available ingredients to satisfy required input in template
  availableIngredients: Ingredient[] = [
    { id: '1', name: 'Chicken Breast', category: 'protein', calories: 165 },
    { id: '2', name: 'Rice', category: 'grain', calories: 130 },
    { id: '3', name: 'Broccoli', category: 'vegetable', calories: 25 }
  ];

  onRecipeCreated(recipe: Recipe) {
    // For demo, simply log. In a real app you might persist via a service here.
    console.log('Recipe created:', recipe);
  }
}
