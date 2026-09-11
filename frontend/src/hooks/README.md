# Custom Hooks Directory

This directory contains all custom React hooks for the ProductEngineering application, following a two-tier architecture pattern.

## Directory Structure

```
hooks/
├── common/          # Tier 1: Reusable pattern hooks
│   ├── useAuth.ts
│   ├── usePaginatedList.ts
│   ├── useEntityForm.ts
│   ├── useDropdownData.ts
│   ├── useEntityDetail.ts
│   ├── useDialogConfirmation.ts
│   ├── useCurrentUser.ts
│   ├── usePdfDownload.ts
│   └── useDebouncedValue.ts
├── auth/            # Authentication-related hooks
├── admin/           # Admin panel hooks (User management, etc.)
├── crud/            # CRUD operation hooks (Public, MDF, MDP, Aluminium, Packaging, Guides, Items)
├── operator/        # Operator-specific hooks (Struct builders, Details, Reports)
├── types.ts         # Shared TypeScript type definitions
└── README.md        # This file
```

## Naming Convention

All hooks follow the pattern: `ComponentName.tsx` → `useComponentName.ts`

**Examples:**
- `Login.tsx` → `useLogin.ts`
- `UserList.tsx` → `useUserList.ts`
- `ColorForm.tsx` → `useColorForm.ts`

## Two-Tier Architecture

### Tier 1: Common Pattern Hooks (`/common`)

Reusable hooks that implement common patterns across the application:

- **useAuth**: Authentication logic (login, logout, token management)
- **usePaginatedList**: Generic paginated list with search, pagination, delete, inactivate
- **useEntityForm**: Generic form with create/edit modes, validation, error handling
- **useDropdownData**: Parallel loading of multiple dropdown data sources
- **useEntityDetail**: Single entity detail view with nested list management
- **useDialogConfirmation**: Confirmation dialog state management
- **useCurrentUser**: Current user profile data fetching
- **usePdfDownload**: PDF generation and file download
- **useDebouncedValue**: Debounced value for search optimization

### Tier 2: Component-Specific Hooks (`/auth`, `/admin`, `/crud`, `/operator`)

Hooks that wrap common patterns with component-specific logic:

- Located in feature-area subdirectories
- Import and configure common hooks with service functions
- Provide type-safe interfaces for specific components
- Hide common hook complexity from components

## Usage Examples

### Using a Common Hook Directly

```typescript
import { usePaginatedList } from '@/hooks/common/usePaginatedList';
import * as colorService from '@/services/corService';

function ColorList() {
  const {
    data: colors,
    loading,
    error,
    handleSearch,
    handleNextPage,
    handleDelete
  } = usePaginatedList({
    fetchFunction: colorService.pesquisarTodos,
    searchColumn: 'nome',
    pageSize: 8,
    deleteFunction: colorService.remover,
    inactivateFunction: colorService.inativar
  });

  // ... component JSX
}
```

### Using a Component-Specific Hook

```typescript
import { useUserList } from '@/hooks/admin/useUserList';

function UserList() {
  const {
    data: users,
    loading,
    error,
    handleSearch,
    handleNextPage,
    handleDelete,
    handleInactivate
  } = useUserList();

  // ... component JSX
}
```

## Testing

All hooks are tested using Vitest and @testing-library/react.

Test files are located alongside hook files with the `.test.ts` extension:
- `useAuth.ts` → `useAuth.test.ts`

Run tests:
```bash
npm test                 # Run all tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

## Migration Guide

When migrating a component to use hooks:

1. **Identify Requirements**: Determine which common pattern hooks apply
2. **Create Component-Specific Hook**: If needed, create a hook in the appropriate subdirectory
3. **Write Tests**: Test the hook in isolation before component integration
4. **Update Component**: Replace direct service calls with hook usage
5. **Verify**: Ensure functional equivalence with original implementation
6. **Clean Up**: Remove direct service imports and legacy code

## Type Safety

All hooks are strongly typed using TypeScript. See `types.ts` for shared type definitions.

**Key Types:**
- `HookState<T>`: Discriminated union for hook states
- `PaginatedListConfig<T>`: Configuration for paginated list hooks
- `EntityFormConfig<T>`: Configuration for form hooks
- `DropdownSource<T>`: Configuration for dropdown data sources

## Best Practices

1. **Dependency Injection**: Pass service functions as parameters (don't import directly in common hooks)
2. **Error Handling**: Always return error state, never throw exceptions
3. **Loading States**: Provide loading indicators for async operations
4. **Type Safety**: Use TypeScript generics for type-safe data handling
5. **Testing**: Achieve minimum 80% test coverage
6. **Documentation**: Add JSDoc comments to all hooks

## Contributing

When adding new hooks:

1. Place in appropriate directory (common vs feature-specific)
2. Follow naming conventions
3. Add comprehensive tests
4. Update this README if adding new patterns
5. Add JSDoc documentation
