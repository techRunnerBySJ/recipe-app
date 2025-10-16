# RecipeApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Approach

- **Architecture**: Angular 16+ standalone APIs (no NgModules) with `App` as the root component and a focused `RecipeBuilderComponent` for building recipes.
- **State & persistence**: Lightweight state held in components; a dedicated `RecipeStorageService` encapsulates browser storage for saving/loading recipes.
- **Testing**: Jest + `jest-preset-angular` for fast, JSDOM-based unit tests; templates are overridden in tests where needed for isolation.

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

## Running unit tests

This project uses Jest.

```bash
npm test
```

- **Watch mode**:

```bash
npm run test:watch
```

- **Coverage report**: Tests are configured to collect coverage. After running `npm test`, open the HTML report at `coverage/lcov-report/index.html`.

## Running end-to-end tests

This repo does not include an e2e setup. You can add one (e.g., Cypress or Playwright) if needed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
