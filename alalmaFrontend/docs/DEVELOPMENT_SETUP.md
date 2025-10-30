# 🛠️ Development Setup Guide - AlAlma Platform

## 📋 Overview

Esta guía completa te ayudará a configurar el entorno de desarrollo local para la plataforma AlAlma, incluyendo instalación de dependencias, configuración de servicios, y workflow de desarrollo.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/alalma-frontend.git
cd alalma-frontend

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn v1.22.0+)
- **Git**: Latest version
- **VS Code**: Recommended IDE

### Operating System Support
- ✅ **macOS**: 10.15+ (Catalina or newer)
- ✅ **Windows**: 10/11 with WSL2 recommended
- ✅ **Linux**: Ubuntu 18.04+, Debian 10+, or equivalent

---

## 🔧 Installation Steps

### 1. Node.js Setup

#### Using Node Version Manager (Recommended)
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install nvm (Windows)
# Download and install from: https://github.com/coreybutler/nvm-windows

# Restart terminal, then:
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show v8.x.x or higher
```

#### Direct Installation
- **macOS**: Download from [nodejs.org](https://nodejs.org/) or use `brew install node`
- **Windows**: Download from [nodejs.org](https://nodejs.org/) or use `winget install Node.js`
- **Linux**: Use package manager or [NodeSource repository](https://github.com/nodesource/distributions)

### 2. Git Configuration
```bash
# Configure Git (first time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: Set default branch name
git config --global init.defaultBranch main

# Optional: Set up SSH key for GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### 3. VS Code Setup (Recommended)

#### Required Extensions
```json
// .vscode/extensions.json (already included in project)
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings
```json
// .vscode/settings.json (already included in project)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 📁 Project Structure Deep Dive

```
alalma-frontend/
├── 📄 README.md                    # Project overview
├── 📄 package.json                # Dependencies and scripts
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.ts          # Tailwind CSS configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 eslint.config.mjs           # ESLint configuration
├── 📄 postcss.config.mjs          # PostCSS configuration
├── 📄 .env.example                # Environment variables template
├── 📄 .env.local                  # Local environment variables (create this)
├── 📄 .gitignore                  # Git ignore rules
│
├── 📁 .vscode/                    # VS Code workspace settings
│   ├── settings.json              # Editor settings
│   └── extensions.json            # Recommended extensions
│
├── 📁 .next/                      # Next.js build output (auto-generated)
├── 📁 node_modules/               # Dependencies (auto-generated)
│
├── 📁 public/                     # Static assets
│   ├── favicon.ico
│   ├── images/
│   └── icons/
│
├── 📁 docs/                       # Documentation
│   ├── architecture.md
│   ├── api-specification.md
│   ├── COMPONENTS_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DEVELOPMENT_SETUP.md (this file)
│
└── 📁 src/                        # Source code
    ├── 📁 app/                    # Next.js 15 App Router pages
    │   ├── globals.css            # Global styles
    │   ├── layout.tsx             # Root layout
    │   ├── page.tsx               # Home page
    │   ├── dashboard/             # User dashboard
    │   ├── live/                  # Live streaming pages
    │   ├── instructors/           # Instructors directory
    │   ├── vendor/                # Vendor pages
    │   ├── admin/                 # Admin interface
    │   └── ...more pages
    │
    ├── 📁 components/             # Reusable components
    │   ├── ui/                    # Basic UI components
    │   ├── auth/                  # Authentication components
    │   ├── ecommerce/             # Shopping components
    │   ├── layout/                # Layout components
    │   └── live/                  # Live streaming components
    │
    ├── 📁 contexts/               # React Context providers
    │   ├── AuthContext.tsx        # Authentication state
    │   ├── LiveContext.tsx        # Live streaming state
    │   └── ...other contexts
    │
    ├── 📁 data/                   # Mock data and types
    │   ├── products.ts            # Sample products
    │   ├── instructors.ts         # Sample instructors
    │   └── plans.ts               # Subscription plans
    │
    ├── 📁 hooks/                  # Custom React hooks
    │   └── useFlyToCart.ts        # Cart animation hook
    │
    ├── 📁 lib/                    # Utilities and configurations
    │   └── utils.ts               # Helper functions
    │
    └── 📁 types/                  # TypeScript type definitions
        └── api.ts                 # API interfaces
```

---

## ⚙️ Environment Configuration

### 1. Environment Variables Setup
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your values
nano .env.local  # or use your preferred editor
```

### 2. Environment Variables Explained
```bash
# .env.local - Development Configuration

# ========================================
# NEXT.JS CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development

# ========================================
# AUTHENTICATION (Mock in Development)
# ========================================
NEXTAUTH_SECRET=your-development-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# ========================================
# PAYMENT INTEGRATION (Test Mode)
# ========================================
# Get test keys from https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
STRIPE_SECRET_KEY=sk_test_your_test_secret_here

# ========================================
# LIVE STREAMING (Test Mode)
# ========================================
# Get test app ID from https://console.agora.io/
NEXT_PUBLIC_AGORA_APP_ID=your_agora_test_app_id
AGORA_APP_CERTIFICATE=your_agora_test_certificate

# ========================================
# WEBSOCKET CONNECTION
# ========================================
NEXT_PUBLIC_WS_URL=ws://localhost:3002

# ========================================
# FEATURE FLAGS (Development)
# ========================================
NEXT_PUBLIC_ENABLE_LIVE_STREAMING=true
NEXT_PUBLIC_ENABLE_PAYMENTS=false  # Set to false for mock payments
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# ========================================
# DEVELOPMENT TOOLS
# ========================================
NEXT_TELEMETRY_DISABLED=1  # Disable Next.js telemetry
ANALYZE=false              # Set to true to analyze bundle
```

### 3. Feature Flags Explanation
```typescript
// Feature flags for development
const featureFlags = {
  // Enable/disable live streaming functionality
  ENABLE_LIVE_STREAMING: process.env.NEXT_PUBLIC_ENABLE_LIVE_STREAMING === 'true',
  
  // Enable/disable real payments (use mock in development)
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  
  // Enable/disable analytics tracking
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
}
```

---

## 🚀 Development Commands

### Core Commands
```bash
# Start development server with hot reload
npm run dev
# Runs on http://localhost:3000

# Build for production (test build locally)
npm run build

# Start production server (after build)
npm run start

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Format code with Prettier
npm run format
```

### Advanced Commands
```bash
# Analyze bundle size
ANALYZE=true npm run build

# Check for unused dependencies
npx depcheck

# Update dependencies (interactive)
npx npm-check-updates -i

# Clean install (remove node_modules and reinstall)
rm -rf node_modules package-lock.json && npm install

# Run in different ports
PORT=3001 npm run dev
```

---

## 📦 Package Management

### Understanding package.json
```json
{
  "name": "alalma-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",      // Development with Turbopack
    "build": "next build",              // Production build
    "start": "next start",              // Production server
    "lint": "next lint",                // ESLint checking
    "type-check": "tsc --noEmit"        // TypeScript checking
  },
  "dependencies": {
    "next": "15.5.4",                   // React framework
    "react": "18.3.1",                 // React library
    "react-dom": "18.3.1",             // React DOM
    "@types/node": "^20",               // Node.js types
    "@types/react": "^18",              // React types
    "@types/react-dom": "^18",          // React DOM types
    "typescript": "^5",                 // TypeScript
    "tailwindcss": "^3.4.1",          // CSS framework
    "lucide-react": "^0.263.1",       // Icons
    "clsx": "^2.0.0",                  // Conditional classes
    "tailwind-merge": "^2.0.0"        // Tailwind class merging
  },
  "devDependencies": {
    "eslint": "^8",                     // Linting
    "eslint-config-next": "15.5.4",    // Next.js ESLint config
    "postcss": "^8",                    // CSS processing
    "autoprefixer": "^10.0.1"          // CSS prefixing
  }
}
```

### Adding New Dependencies
```bash
# Add production dependency
npm install package-name

# Add development dependency
npm install -D package-name

# Add specific version
npm install package-name@1.2.3

# Add from GitHub
npm install user/repo

# Update specific package
npm update package-name
```

---

## 🔍 Development Tools

### 1. Browser DevTools Setup

#### React Developer Tools
```bash
# Install React DevTools extension for:
# - Chrome: Chrome Web Store
# - Firefox: Firefox Add-ons
# - Edge: Edge Add-ons

# Features:
# - Component tree inspection
# - Props and state debugging  
# - Context values inspection
# - Performance profiling
```

#### Useful Browser Extensions
- **Redux DevTools**: For state debugging (if using Redux)
- **Axe DevTools**: For accessibility testing
- **Lighthouse**: For performance auditing
- **JSON Viewer**: For API response inspection

### 2. CLI Tools
```bash
# Install useful global tools
npm install -g @next/codemod    # Next.js codemods
npm install -g npm-check-updates # Dependency updates
npm install -g serve            # Static file serving
npm install -g http-server      # Simple HTTP server
```

### 3. Git Hooks (Optional)
```bash
# Install husky for git hooks
npm install -D husky lint-staged

# Set up pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

---

## 🧪 Testing Setup

### 1. Install Testing Dependencies
```bash
# Install testing framework
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @types/jest

# Install additional testing utilities
npm install -D jest-environment-jsdom
```

### 2. Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### 3. Test Scripts
```json
// Add to package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🎨 Styling & Design System

### 1. Tailwind CSS Configuration
```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          500: '#a855f7',   // Purple-500
          600: '#9333ea',   // Purple-600
          700: '#7c3aed',   // Purple-700
        },
        secondary: {
          500: '#ec4899',   // Pink-500
          600: '#db2777',   // Pink-600
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
export default config
```

### 2. Custom CSS Classes
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md border border-gray-200 p-6;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
}
```

---

## 🔌 API Integration

### 1. Mock API Setup (Development)
```typescript
// lib/mockApi.ts
export const mockApi = {
  // Simulate API delays
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock authentication
  login: async (email: string, password: string) => {
    await mockApi.delay(1000) // Simulate network delay
    
    if (email === 'user@example.com' && password === 'password') {
      return {
        success: true,
        user: { id: '1', email, name: 'Test User' },
        token: 'mock-jwt-token'
      }
    }
    
    throw new Error('Invalid credentials')
  },
  
  // Mock data fetching
  getProducts: async (filters?: any) => {
    await mockApi.delay(500)
    return {
      success: true,
      data: mockProducts,
      total: mockProducts.length
    }
  }
}
```

### 2. API Client Setup
```typescript
// lib/apiClient.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private baseURL: string
  
  constructor() {
    this.baseURL = API_BASE_URL
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }
    
    // Add auth token if available
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }
  
  // API methods
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }
  
  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
```

---

## 📱 Mobile Development

### 1. Responsive Design Testing
```bash
# Use browser dev tools or install:
npm install -g browser-sync

# Start with mobile-first approach
browser-sync start --server --files "src/**/*"
```

### 2. Mobile-Specific Considerations
```css
/* Mobile-optimized styles */
@media (max-width: 768px) {
  .mobile-nav {
    @apply fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200;
  }
  
  .mobile-scroll {
    @apply overflow-x-auto scroll-smooth;
  }
}

/* Touch-friendly interactive elements */
.touch-target {
  @apply min-h-[44px] min-w-[44px]; /* 44px minimum for touch targets */
}
```

---

## 🐛 Debugging Guide

### 1. Common Issues & Solutions

#### Issue: Module not found errors
```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run dev
```

#### Issue: TypeScript errors
```bash
# Solution: Restart TypeScript server in VS Code
# Command Palette (Cmd/Ctrl + Shift + P) > "TypeScript: Restart TS Server"

# Or check types manually
npm run type-check
```

#### Issue: Styling not updating
```bash
# Solution: Clear Tailwind cache
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

#### Issue: Environment variables not working
```bash
# Check file name (must be .env.local for Next.js)
ls -la .env*

# Restart development server after changes
npm run dev
```

### 2. Debug Tools
```typescript
// Debug utilities
export const debugUtils = {
  // Log component renders
  useRenderLogger: (componentName: string) => {
    useEffect(() => {
      console.log(`${componentName} rendered`)
    })
  },
  
  // Log state changes
  useStateLogger: (state: any, stateName: string) => {
    useEffect(() => {
      console.log(`${stateName} changed:`, state)
    }, [state])
  },
  
  // Performance measuring
  measurePerformance: (fn: Function, label: string) => {
    console.time(label)
    const result = fn()
    console.timeEnd(label)
    return result
  }
}
```

---

## 🔄 Development Workflow

### 1. Daily Development Cycle
```bash
# 1. Start your day
git pull origin main           # Get latest changes
npm install                    # Install any new dependencies
npm run dev                    # Start development server

# 2. Work on features
git checkout -b feature/new-feature
# Make your changes...
npm run lint                   # Check for issues
npm run type-check            # Verify TypeScript

# 3. Commit changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 4. End of day
git checkout main
git pull origin main
```

### 2. Code Quality Checklist
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Components properly typed
- [ ] Responsive design tested
- [ ] Accessibility considerations
- [ ] Performance optimized
- [ ] Error handling implemented

### 3. Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git add .
git commit -m "feat: description"
git push origin feature/feature-name

# Bug fixes
git checkout -b fix/bug-description
git add .
git commit -m "fix: description"
git push origin fix/bug-description

# Code review process
# 1. Create pull request
# 2. Request review
# 3. Address feedback
# 4. Merge when approved
```

---

## 🚀 Performance Tips

### 1. Development Performance
```bash
# Use Turbopack for faster builds
npm run dev  # Already configured with --turbopack

# Optimize VS Code performance
# - Disable unnecessary extensions
# - Exclude node_modules from search
# - Use TypeScript project references
```

### 2. Code Performance
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
})

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // Handle click
}, [dependency])
```

---

## 📚 Learning Resources

### 1. Essential Documentation
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

### 2. Project-Specific Resources
- **Architecture Overview**: `docs/architecture.md`
- **Component Documentation**: `docs/COMPONENTS_DOCUMENTATION.md`
- **API Specification**: `docs/api-specification.md`
- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`

### 3. Video Tutorials
- Next.js 15 App Router
- React Context API patterns
- TypeScript best practices
- Tailwind CSS responsive design

---

## 🆘 Getting Help

### 1. Internal Resources
```bash
# Project documentation
ls docs/                       # Read all documentation files

# Code examples
grep -r "example-pattern" src/ # Find code patterns

# Component usage
grep -r "ComponentName" src/   # See how components are used
```

### 2. External Help
- **Stack Overflow**: Tag questions with `next.js`, `react`, `typescript`
- **Discord Communities**: Next.js, React, TypeScript servers
- **GitHub Issues**: Check project repository for similar issues

### 3. Team Communication
- **Code Reviews**: Always request peer review
- **Documentation**: Update docs when adding features
- **Issue Tracking**: Use GitHub issues for bugs and features

---

## ✅ Development Checklist

### Initial Setup ✅
- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser extensions installed
- [ ] VS Code configured with recommended extensions

### Daily Development ✅
- [ ] Latest changes pulled from main
- [ ] Feature branch created
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Components tested in browser
- [ ] Mobile responsiveness verified
- [ ] Changes committed with descriptive messages
- [ ] Pull request created when ready

### Code Quality ✅
- [ ] All imports properly typed
- [ ] Components use proper TypeScript interfaces
- [ ] Error boundaries implemented where needed
- [ ] Loading states handled
- [ ] Accessibility attributes added
- [ ] Performance optimizations applied
- [ ] Documentation updated

---

## 🎉 You're Ready to Develop!

With this setup complete, you have:

- ✅ **Full development environment** configured
- ✅ **All tools and extensions** installed
- ✅ **Project structure** understood
- ✅ **Development workflow** established
- ✅ **Debug tools** ready
- ✅ **Performance optimization** knowledge
- ✅ **Code quality standards** defined

**Happy coding! 🚀**

For any issues or questions, refer to the documentation in the `docs/` folder or reach out to the development team.