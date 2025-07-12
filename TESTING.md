# Testing Documentation

This project uses Jest and React Native Testing Library for testing React Native components and functionality.

## Setup

The testing setup includes:

- **Jest**: JavaScript testing framework
- **jest-expo**: Jest preset for Expo projects
- **@testing-library/react-native**: Testing utilities for React Native components
- **react-test-renderer**: Required for component testing

## Configuration

Jest is configured in `package.json` with the following key settings:

- **Preset**: `jest-expo` for Expo-specific configurations
- **Setup**: `jest.setup.ts` for test environment configuration
- **Transform Ignore Patterns**: Configured to properly handle React Native and Expo modules
- **Test Match**: Finds test files in `__tests__` folders and files with `.test.` or `.spec.` extensions

## Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── ProductCard.test.tsx
│   └── ...
├── screens/            # Screen/page tests
│   ├── search.test.tsx
│   └── ...
├── store/              # State management tests
│   ├── cartStore.test.ts
│   ├── userStore.test.ts
│   └── ...
└── utils/              # Utility function tests
    ├── products.test.ts
    ├── theme.test.ts
    └── ...
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Test Types

### 1. Component Tests
Test React Native components for:
- Proper rendering
- User interactions
- Props handling
- State changes

Example:
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../components/ProductCard';

test('should render product name', () => {
  const { getByText } = render(<ProductCard product={mockProduct} />);
  expect(getByText('Product Name')).toBeTruthy();
});
```

### 2. Store Tests
Test Zustand stores for:
- State changes
- Action functionality
- Data persistence

Example:
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCartStore } from '../store/cartStore';

test('should add item to cart', () => {
  const { result } = renderHook(() => useCartStore());
  act(() => {
    result.current.addItem(mockItem);
  });
  expect(result.current.items).toHaveLength(1);
});
```

### 3. Utility Tests
Test pure functions and utilities:
- Search functionality
- Data transformation
- Theme configuration

Example:
```typescript
import { searchProducts } from '../products';

test('should filter products by query', () => {
  const results = searchProducts('milk');
  expect(results.length).toBeGreaterThan(0);
});
```

### 4. Screen Tests
Test screen components for:
- Navigation
- User flows
- Integration with stores
- API interactions

## Mocking

### Expo Modules
Common Expo modules are mocked in `jest.setup.ts`:
- `expo-router`
- `@expo/vector-icons`
- `expo-haptics`
- `expo-blur`
- `react-native-safe-area-context`
- `react-native-reanimated`

### Custom Mocks
For project-specific functionality:

```typescript
jest.mock('../products', () => ({
  searchProducts: jest.fn(() => []),
}));
```

## Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach` for setup
- Keep tests focused and isolated

### 2. Assertions
- Use appropriate matchers (`toBe`, `toEqual`, `toHaveLength`, etc.)
- Test both positive and negative cases
- Verify side effects and state changes

### 3. Mocking
- Mock external dependencies
- Use `jest.clearAllMocks()` in `beforeEach`
- Mock only what's necessary for the test

### 4. Coverage
- Aim for high coverage but focus on critical paths
- Test edge cases and error conditions
- Use coverage reports to identify untested code

## Common Testing Patterns

### Testing User Interactions
```typescript
const button = getByText('Add to Cart');
fireEvent.press(button);
expect(mockFunction).toHaveBeenCalled();
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(getByText('Loading complete')).toBeTruthy();
});
```

### Testing Navigation
```typescript
const mockRouter = { push: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));
// ... test navigation calls
expect(mockRouter.push).toHaveBeenCalledWith('/expected-route');
```

### Testing Forms
```typescript
const input = getByPlaceholderText('Search...');
fireEvent.changeText(input, 'test query');
expect(input.props.value).toBe('test query');
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure dependencies are installed and mocked properly
2. **Component type errors**: Import actual components instead of using string types
3. **Async test failures**: Use `waitFor` for async operations
4. **Mock issues**: Check that mocks are properly reset between tests

### Debug Tips

- Use `screen.debug()` to see rendered component tree
- Add `console.log` in tests for debugging
- Use `--verbose` flag for detailed test output
- Check Jest configuration if tests aren't running

## Additional Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Expo Testing Guide](https://docs.expo.dev/guides/testing-with-jest/)
