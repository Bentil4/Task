# Project Structure

This Angular project follows the official Angular Style Guide for optimal organization and maintainability.

## Directory Structure

```
src/app/
├── core/                    # Singleton services, guards, and shell components
│   ├── components/          # Shell components (layout, error pages)
│   │   ├── layout/         # Main application shell
│   │   └── page-not-found/ # 404 error page
│   ├── constants/          # Application-wide constants
│   ├── guards/             # Route guards used across features
│   ├── models/             # Core data models
│   └── services/           # Singleton services (theme, storage, board)
├── features/               # Feature modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth-specific components
│   │   ├── guards/        # Auth-specific guards
│   │   └── auth.service.ts # Auth service
│   ├── board/             # Board management feature
│   │   ├── components/    # Board-related components
│   │   └── board.routes.ts # Board routing
│   └── settings/          # Settings feature
└── shared/                # Reusable components, pipes, directives
    └── components/        # Shared UI components
```

## Key Principles Applied

### 1. Feature-Based Organization
- Each feature has its own directory under `features/`
- Feature-specific components, services, and guards are co-located
- Clear separation of concerns between features

### 2. Core Module Pattern
- `core/` contains singleton services and shell components
- Guards that protect multiple routes are in `core/guards/`
- Application-wide models and constants in `core/`

### 3. Shared Module Pattern
- `shared/` contains reusable components used across features
- Components like buttons, form controls, and utility components
- No feature-specific logic in shared components

### 4. Barrel Exports (Index Files)
- Index files in each directory for cleaner imports
- Reduces coupling and improves maintainability
- Example: `import { ThemeService } from './core/services'`

### 5. Naming Conventions
- PascalCase for component classes
- kebab-case for file names
- Descriptive and consistent naming throughout

## Benefits

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear separation makes code easier to understand and modify
3. **Reusability**: Shared components can be used across multiple features
4. **Testing**: Isolated features are easier to test
5. **Team Collaboration**: Clear structure helps team members navigate the codebase

## Import Guidelines

- Use barrel exports for cleaner imports
- Import from the closest common ancestor
- Avoid deep relative paths (../../../)
- Prefer absolute imports for core services and models