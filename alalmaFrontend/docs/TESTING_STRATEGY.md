# 🧪 Testing Strategy Documentation - AlAlma Platform

## 📋 Overview

Esta documentación completa define la estrategia de testing para la plataforma AlAlma, incluyendo configuración de herramientas, tipos de tests, patrones de testing, y mejores prácticas para garantizar la calidad del código.

---

## 🎯 Testing Philosophy

### Core Principles
1. **Test-Driven Development (TDD)**: Escribir tests antes que el código cuando sea posible
2. **Testing Pyramid**: Más unit tests, menos integration tests, mínimos E2E tests
3. **Confidence over Coverage**: Priorizar tests que dan confianza real sobre métricas de cobertura
4. **Fast Feedback**: Tests rápidos para desarrollo ágil
5. **Maintainable Tests**: Tests fáciles de leer, entender y mantener

### Testing Pyramid for AlAlma
```
     🔺 E2E Tests (5%)
    ───────────────────
   🔶 Integration Tests (15%)
  ─────────────────────────────
 🔷 Unit Tests (80%)
───────────────────────────────
```

---

## 🛠️ Testing Setup & Configuration

### 1. Install Testing Dependencies

```bash
# Core testing framework
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D @types/jest

# Next.js testing utilities
npm install -D @testing-library/react-hooks
npm install -D jest-environment-jsdom

# Additional testing utilities
npm install -D msw  # Mock Service Worker for API mocking
npm install -D @testing-library/react-select  # For select component testing
```

### 2. Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/data/(.*)$': '<rootDir>/src/data/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.config.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### 3. Jest Setup File

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
})
```

### 4. Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:debug": "jest --detectOpenHandles --runInBand",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "cypress run",
    "test:e2e:dev": "cypress open"
  }
}
```

---

## 🔬 Unit Testing

### 1. Component Testing Patterns

#### Basic Component Test
```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary-600')
  })

  it('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

#### Context Testing
```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// Test component that uses the context
const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('provides authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated')
  })

  it('handles login correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    fireEvent.click(screen.getByText('Login'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated')
    })
  })
})
```

#### Hook Testing
```typescript
// src/hooks/__tests__/useFlyToCart.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useFlyToCart } from '../useFlyToCart'

describe('useFlyToCart', () => {
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useFlyToCart())
    
    expect(result.current.isAnimating).toBe(false)
    expect(typeof result.current.triggerFlyToCart).toBe('function')
  })

  it('handles animation trigger', () => {
    const { result } = renderHook(() => useFlyToCart())
    
    // Mock DOM element
    const mockElement = document.createElement('div')
    
    act(() => {
      result.current.triggerFlyToCart('product-1', mockElement)
    })
    
    expect(result.current.isAnimating).toBe(true)
  })
})
```

### 2. Testing Utilities

```typescript
// src/test-utils/index.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserPlanProvider } from '@/contexts/UserPlanContext'
import { FavoritesCartProvider } from '@/contexts/FavoritesCartContext'

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialAuthState?: any
  initialPlanState?: any
}

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UserPlanProvider>
        <FavoritesCartProvider>
          {children}
        </FavoritesCartProvider>
      </UserPlanProvider>
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data factories
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  title: 'Test Product',
  description: 'Test description',
  price: 29.99,
  category: 'curso',
  rating: 4.5,
  image: '/test-image.jpg',
  requiredPlan: 'free',
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: '/test-avatar.jpg',
  plan: 'free',
  ...overrides,
})

export const createMockInstructor = (overrides = {}) => ({
  id: '1',
  name: 'Test Instructor',
  specialties: ['Mindfulness'],
  rating: 4.8,
  experience: '5+ years',
  students: 1250,
  isVerified: true,
  bio: 'Test bio',
  image: '/test-instructor.jpg',
  hourlyRate: 75,
  ...overrides,
})

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
```

### 3. API Mocking with MSW

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw'
import { mockProducts } from '@/data/products'
import { mockInstructors } from '@/data/instructors'

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as any
    
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          user: { id: '1', email, name: 'Test User' },
          token: 'mock-token'
        })
      )
    }
    
    return res(
      ctx.status(401),
      ctx.json({ success: false, error: 'Invalid credentials' })
    )
  }),

  // Products endpoints
  rest.get('/api/products', (req, res, ctx) => {
    const category = req.url.searchParams.get('category')
    let products = mockProducts
    
    if (category) {
      products = mockProducts.filter(p => p.category === category)
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: products,
        total: products.length
      })
    )
  }),

  // Instructors endpoints
  rest.get('/api/instructors', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockInstructors,
        total: mockInstructors.length
      })
    )
  }),

  // Live streaming endpoints
  rest.get('/api/live/sessions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [], // Mock live sessions
        total: 0
      })
    )
  }),
]
```

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

```typescript
// Update jest.setup.js
import { server } from './src/mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we add during the tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())
```

---

## 🔗 Integration Testing

### 1. Feature Testing

```typescript
// src/__tests__/integration/ProductPurchase.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { server } from '@/mocks/server'
import { rest } from 'msw'
import Dashboard from '@/app/dashboard/page'

describe('Product Purchase Flow', () => {
  it('completes full purchase flow', async () => {
    // Mock authenticated user
    const mockUser = { id: '1', name: 'Test User', plan: 'basic' }
    
    render(<Dashboard />, {
      initialAuthState: { isAuthenticated: true, user: mockUser }
    })

    // 1. Find and click on a product
    const productCard = await screen.findByTestId('product-card-1')
    fireEvent.click(productCard)

    // 2. Add to cart
    const addToCartButton = await screen.findByText('Add to Cart')
    fireEvent.click(addToCartButton)

    // 3. Open cart
    const cartButton = screen.getByTestId('cart-button')
    fireEvent.click(cartButton)

    // 4. Proceed to checkout
    const checkoutButton = await screen.findByText('Checkout')
    fireEvent.click(checkoutButton)

    // 5. Verify purchase completion
    await waitFor(() => {
      expect(screen.getByText('Purchase Successful')).toBeInTheDocument()
    })
  })

  it('handles insufficient plan access', async () => {
    // Mock user with free plan trying to access premium content
    const mockUser = { id: '1', name: 'Test User', plan: 'free' }
    
    render(<Dashboard />, {
      initialAuthState: { isAuthenticated: true, user: mockUser }
    })

    // Try to access premium product
    const premiumProduct = await screen.findByTestId('premium-product-1')
    fireEvent.click(premiumProduct)

    // Should show upgrade prompt
    await waitFor(() => {
      expect(screen.getByText('Upgrade Required')).toBeInTheDocument()
    })
  })
})
```

### 2. Context Integration Testing

```typescript
// src/__tests__/integration/LiveStreaming.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import { LiveProvider } from '@/contexts/LiveContext'
import LivePage from '@/app/live/page'

describe('Live Streaming Integration', () => {
  it('displays live sessions and allows joining', async () => {
    // Mock live sessions
    const mockSessions = [
      {
        id: '1',
        title: 'Mindfulness Session',
        isLive: true,
        viewers: 45,
        accessLevel: 'free'
      }
    ]

    render(
      <LiveProvider>
        <LivePage />
      </LiveProvider>
    )

    // Should display live sessions
    await waitFor(() => {
      expect(screen.getByText('Mindfulness Session')).toBeInTheDocument()
    })

    // Click to join session
    const joinButton = screen.getByText('Join Session')
    fireEvent.click(joinButton)

    // Should navigate to session page
    await waitFor(() => {
      expect(screen.getByText('Live Session')).toBeInTheDocument()
    })
  })
})
```

---

## 🌐 End-to-End Testing

### 1. Cypress Setup

```bash
# Install Cypress
npm install -D cypress @cypress/react

# Install additional Cypress plugins
npm install -D @testing-library/cypress-commands
```

```javascript
// cypress.config.js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshot: false,
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: {
    // Test user credentials
    TEST_EMAIL: 'test@example.com',
    TEST_PASSWORD: 'password123',
  },
})
```

### 2. E2E Test Examples

```typescript
// cypress/e2e/user-authentication.cy.ts
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('allows user to sign up and login', () => {
    // Go to signup page
    cy.get('[data-testid=signup-button]').click()
    
    // Fill signup form
    cy.get('[data-testid=email-input]').type('newuser@example.com')
    cy.get('[data-testid=password-input]').type('password123')
    cy.get('[data-testid=name-input]').type('New User')
    
    // Submit form
    cy.get('[data-testid=signup-submit]').click()
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid=user-name]').should('contain', 'New User')
  })

  it('handles login errors gracefully', () => {
    cy.get('[data-testid=login-button]').click()
    
    // Try invalid credentials
    cy.get('[data-testid=email-input]').type('invalid@example.com')
    cy.get('[data-testid=password-input]').type('wrongpassword')
    cy.get('[data-testid=login-submit]').click()
    
    // Should show error message
    cy.get('[data-testid=error-message]').should('be.visible')
    cy.get('[data-testid=error-message]').should('contain', 'Invalid credentials')
  })
})
```

```typescript
// cypress/e2e/live-streaming.cy.ts
describe('Live Streaming', () => {
  beforeEach(() => {
    // Login as authenticated user
    cy.login('test@example.com', 'password123')
    cy.visit('/live')
  })

  it('displays live sessions correctly', () => {
    // Should show live sessions list
    cy.get('[data-testid=live-sessions-list]').should('be.visible')
    
    // Should show session cards
    cy.get('[data-testid=session-card]').should('have.length.greaterThan', 0)
    
    // Should show live indicators
    cy.get('[data-testid=live-indicator]').should('be.visible')
  })

  it('allows joining a live session', () => {
    // Click on first session
    cy.get('[data-testid=session-card]').first().click()
    
    // Should navigate to session page
    cy.url().should('include', '/live/')
    
    // Should show video player
    cy.get('[data-testid=video-player]').should('be.visible')
    
    // Should show chat box
    cy.get('[data-testid=chat-box]').should('be.visible')
  })

  it('handles session access control', () => {
    // Try to join premium session as free user
    cy.get('[data-testid=premium-session]').click()
    
    // Should show upgrade modal
    cy.get('[data-testid=upgrade-modal]').should('be.visible')
    cy.get('[data-testid=upgrade-button]').should('be.visible')
  })
})
```

### 3. Custom Cypress Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
      addToCart(productId: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-testid=email-input]').type(email)
  cy.get('[data-testid=password-input]').type(password)
  cy.get('[data-testid=login-submit]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid=user-menu]').click()
  cy.get('[data-testid=logout-button]').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})

Cypress.Commands.add('addToCart', (productId: string) => {
  cy.get(`[data-testid=product-${productId}]`).within(() => {
    cy.get('[data-testid=add-to-cart]').click()
  })
  cy.get('[data-testid=cart-notification]').should('be.visible')
})
```

---

## 📊 Test Coverage & Quality

### 1. Coverage Configuration

```json
// Add to package.json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:coverage:watch": "jest --coverage --watchAll",
    "test:coverage:ci": "jest --coverage --ci --watchAll=false --passWithNoTests"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.{js,jsx,ts,tsx}",
      "!src/**/index.{js,jsx,ts,tsx}"
    ],
    "coverageReporters": ["text", "lcov", "html"],
    "coverageDirectory": "coverage"
  }
}
```

### 2. Quality Gates

```javascript
// jest.config.js - Coverage thresholds
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Specific file patterns
    './src/components/**/*.{js,jsx,ts,tsx}': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/contexts/**/*.{js,jsx,ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
}
```

---

## 🚀 CI/CD Integration

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:ci
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        file: ./coverage/lcov.info
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: |
        npm run build
        npm run start &
        npx wait-on http://localhost:3000
        npm run test:e2e:ci
```

### 2. Pre-commit Hooks

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run lint
npm run test:coverage
```

---

## 🎯 Testing Best Practices

### 1. Writing Good Tests

#### ✅ Good Test Practices
```typescript
// ✅ Descriptive test names
describe('ProductCard component', () => {
  it('should display product title and price correctly', () => {
    // Test implementation
  })
  
  it('should call onAddToCart when add button is clicked', () => {
    // Test implementation
  })
})

// ✅ Test behavior, not implementation
it('should show error message when login fails', async () => {
  // Focus on what the user experiences
  const { getByRole, getByText } = render(<LoginForm />)
  
  fireEvent.click(getByRole('button', { name: /login/i }))
  
  await waitFor(() => {
    expect(getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})

// ✅ Use data-testid for complex queries
<button data-testid="add-to-cart-button" onClick={handleAddToCart}>
  Add to Cart
</button>

const addButton = screen.getByTestId('add-to-cart-button')
```

#### ❌ Avoid These Patterns
```typescript
// ❌ Testing implementation details
it('should call useState with correct initial value', () => {
  // Don't test React internals
})

// ❌ Overly complex test setup
it('should work', () => {
  const wrapper = mount(
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <ComponentWithTooManyDependencies />
        </ThemeProvider>
      </Router>
    </Provider>
  )
  // Complex test that's hard to understand
})

// ❌ Testing multiple behaviors in one test
it('should handle everything', () => {
  // Test 1: rendering
  // Test 2: clicking
  // Test 3: API calls
  // Test 4: error handling
  // Too much in one test!
})
```

### 2. Test Organization

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
├── contexts/
│   ├── AuthContext.tsx  
│   └── __tests__/
│       └── AuthContext.test.tsx
├── hooks/
│   ├── useFlyToCart.ts
│   └── __tests__/
│       └── useFlyToCart.test.tsx
└── __tests__/
    ├── integration/
    │   ├── ProductPurchase.test.tsx
    │   └── LiveStreaming.test.tsx
    └── utils/
        ├── test-utils.tsx
        └── mock-data.ts
```

### 3. Performance Testing

```typescript
// Performance testing example
import { render, screen } from '@testing-library/react'
import { performance } from 'perf_hooks'

describe('Performance Tests', () => {
  it('should render ProductList quickly with many items', () => {
    const manyProducts = Array.from({ length: 1000 }, (_, i) => 
      createMockProduct({ id: i.toString() })
    )
    
    const startTime = performance.now()
    render(<ProductList products={manyProducts} />)
    const endTime = performance.now()
    
    const renderTime = endTime - startTime
    expect(renderTime).toBeLessThan(100) // Should render in under 100ms
  })
})
```

---

## 📋 Testing Checklist

### Component Testing ✅
- [ ] All props are tested
- [ ] Event handlers are tested
- [ ] Conditional rendering is tested
- [ ] Error states are tested
- [ ] Loading states are tested
- [ ] Accessibility attributes are tested

### Context Testing ✅
- [ ] Initial state is correct
- [ ] State updates work correctly
- [ ] Actions are dispatched correctly
- [ ] Context provides expected values
- [ ] Error handling works

### Integration Testing ✅
- [ ] User flows work end-to-end
- [ ] Context providers work together
- [ ] API calls are handled correctly
- [ ] Error boundaries catch errors
- [ ] Navigation works correctly

### E2E Testing ✅
- [ ] Critical user paths work
- [ ] Authentication flows work
- [ ] Payment processes work
- [ ] Live streaming features work
- [ ] Mobile responsiveness works

---

## 🐛 Debugging Tests

### 1. Common Issues & Solutions

#### Tests Failing Randomly
```bash
# Run tests in band (no parallel execution)
npm test -- --runInBand

# Run specific test file
npm test -- Button.test.tsx

# Debug mode
npm test -- --detectOpenHandles --forceExit
```

#### Async Issues
```typescript
// ✅ Use waitFor for async behavior
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// ✅ Use findBy queries for async elements
const successMessage = await screen.findByText('Success')

// ❌ Don't use arbitrary timeouts
setTimeout(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
}, 1000)
```

#### Mock Issues
```typescript
// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks()
})

// Reset modules if needed
afterEach(() => {
  jest.resetModules()
})
```

### 2. Debug Tools

```typescript
// Debug utilities for tests
import { screen } from '@testing-library/react'

// Print current DOM structure
screen.debug()

// Print specific element
screen.debug(screen.getByTestId('my-element'))

// Custom debug function
const debugComponent = (component: any) => {
  console.log('Component props:', component.props)
  console.log('Component state:', component.state)
}
```

---

## 📈 Test Metrics & Reporting

### 1. Coverage Reports

```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage report
open coverage/lcov-report/index.html
```

### 2. Test Performance Monitoring

```typescript
// Add to jest.config.js
module.exports = {
  // Monitor slow tests
  slowTestThreshold: 5, // 5 seconds
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Force exit after tests
  forceExit: true,
}
```

---

## 🎉 Conclusion

Esta estrategia de testing completa asegura:

- ✅ **Alta Calidad de Código**: Tests comprensivos en todos los niveles
- ✅ **Confianza en Deployments**: Tests automatizados en CI/CD
- ✅ **Desarrollo Rápido**: Tests rápidos y feedback inmediato
- ✅ **Mantenibilidad**: Tests fáciles de leer y mantener
- ✅ **Cobertura Completa**: Unit, Integration y E2E testing

**Con esta configuración, el equipo de AlAlma puede desarrollar con confianza sabiendo que el código está bien testeado y funcionará correctamente en producción! 🚀**