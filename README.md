# Kanban

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## GitHub URL
https://github.com/Bentil4/Task.git

## Deploy URL 
https://task-gray-ten.vercel.app/

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

## Testing

This project uses [Jest](https://jestjs.io/) as the testing framework, replacing the default Jasmine/Karma setup.

### Running Tests

To execute unit tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

To generate code coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view detailed coverage metrics.
![alt text](<public/test cov.png>)

### Test Organization

Test files follow the naming convention `*.spec.ts` and are located alongside their corresponding source files:

- **Component Tests**: Test UI components, inputs/outputs, and template bindings
- **Service Tests**: Test business logic, data management, and API interactions
- **Interceptor Tests**: Test HTTP error handling and request/response transformations
- **Integration Tests**: Test component-service interactions using TestBed

### Coverage Thresholds

Minimum coverage requirements:
- Statements: 50%
- Branches: 30%
- Functions: 40%
- Lines: 50%

### Testing Best Practices

1. Write tests alongside new features
2. Use descriptive test names that explain the expected behavior
3. Mock external dependencies (services, HTTP calls)
4. Test edge cases (null, undefined, empty arrays)
5. Use `jest.useFakeTimers()` for testing async operations with timeouts
6. Leverage TestBed for integration testing

## Running unit tests

To execute unit tests with Jest, use the following command:

```bash
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Preview

![alt kanban preview](public/assets/preview.jpg)