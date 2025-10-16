# RecipeApp

A modern Angular recipe builder application that allows users to create, save, and manage recipes with ingredient tracking and calorie calculation.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Approach

### Architecture
- **Modern Angular**: Built with Angular 20+ using standalone components (no NgModules) for a cleaner, more modular architecture
- **Component Structure**: 
  - `App` component as the root with ingredient data
  - `RecipeBuilderComponent` as the main feature component handling recipe creation and management
- **Reactive Programming**: Leverages Angular signals for reactive state management and computed values
- **Form Handling**: Uses Angular Reactive Forms with validation for robust user input handling

### State Management & Persistence
- **Component State**: Uses Angular signals for local state management (ingredients, selected items, form data)
- **Data Persistence**: `RecipeStorageService` handles localStorage operations for recipe persistence
- **Computed Values**: Real-time calorie calculation using computed signals
- **Event Communication**: Uses Angular outputs for parent-child communication

### Key Features
- **Ingredient Management**: Categorized ingredients (protein, vegetable, grain) with calorie tracking
- **Recipe Building**: Interactive ingredient selection with real-time calorie calculation
- **Recipe Storage**: Save and manage multiple recipes with localStorage persistence
- **Form Validation**: Required recipe names and ingredient selection validation
- **Responsive UI**: Clean, modern interface with proper form states and error handling

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

4. **Open the app**: Navigate to `http://localhost:4200/`

## Project Structure

```
src/app/
├── app.ts                    # Root component with ingredient data
├── app.html                  # Root template
├── recipe-builder.component.ts    # Main recipe builder component
├── recipe-builder.component.html  # Recipe builder template
├── recipe-builder.component.css   # Recipe builder styles
├── recipe-storage.service.ts      # localStorage service for recipes
└── *.spec.ts                # Unit tests for components and services
```

### Key Files
- **`recipe-builder.component.ts`**: Main component with signals, forms, and recipe logic
- **`recipe-storage.service.ts`**: Service handling localStorage operations for recipe persistence
- **`jest.config.ts`**: Jest configuration for testing
- **`package.json`**: Dependencies and scripts

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Tests

This project uses **Jest** with `jest-preset-angular` for fast, reliable unit testing.

### Test Configuration
- **Test Environment**: JSDOM for DOM simulation
- **Coverage**: Automatically collected for all test runs
- **Setup**: Jest configuration in `jest.config.ts` with Angular-specific presets

### Running Tests

#### Run all tests once:
```bash
npm test
```

#### Run tests in watch mode (for development):
```bash
npm run test:watch
```

#### View Coverage Report:
After running tests, open the detailed HTML coverage report:
```bash
open coverage/lcov-report/index.html
```

### Test Structure
- **Component Tests**: `RecipeBuilderComponent` tests with mocked dependencies
- **Service Tests**: `RecipeStorageService` tests with localStorage mocking
- **Integration Tests**: Form validation and user interaction flows
- **Isolation**: Tests use mocked templates and services for proper unit isolation

### Key Testing Features
- **Signal Testing**: Proper testing of Angular signals and computed values
- **Form Testing**: Reactive form validation and state testing
- **Service Mocking**: localStorage operations are mocked for reliable testing
- **Event Testing**: Output events and component communication testing

## Running end-to-end tests

This repo does not include an e2e setup. You can add one (e.g., Cypress or Playwright) if needed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
