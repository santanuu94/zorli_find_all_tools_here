# Zorli Project Review & Knowledge Base

## 📋 Project Overview
Zorli is a modern web utility platform offering browser-based tools for images, PDFs, development, text, calculations, and more. Built with React, TypeScript, Vite, and Tailwind CSS.

**Tech Stack:**
- Framework: React 19.0.1
- Language: TypeScript 5.9.3
- Build Tool: Vite 8.3.0
- Styling: Tailwind CSS 4.3.3
- Icons: Lucide React
- Animations: Motion
- State Management: React hooks (useState, useEffect)
- Testing: Jest (configured but tests need setup Fix)

## 🗂️ Directory Structure
```
zorli/
├── src/
│   ├── App.tsx              # Main application router
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles & Tailwind imports
│   ├── test-env.d.ts        # TypeScript test environment
│   │
│   ├── assets/              # Static assets (images, etc.)
│   │
│   ├── components/          # Reusable UI components
│   │   ├── brand/           # Brand components (logo, sparkles)
│   │   ├── footer/          # Footer component
│   │   ├── hero/            # Hero section components
│   │   ├── navigation/      # Navbar & mobile bottom bar
│   │   ├── pages/           # Page components (routing views)
│   │   ├── sections/        # Section components (Hero, CTA, etc.)
│   │   ├── tools/           # Tool-specific components (cards, search, modal)
│   │   └── ui/              # Generic UI primitives (Button, Card, Container, etc.)
│   │
│   ├── data/                # Static data definitions
│   │   ├── categories.ts    # Tool categories definition
│   │   └── tools.ts         # Tools registry & exports
│   │
│   ├── features/            # Feature-specific tool implementations
│   │   └── tools/           # Organized by tool type (image, pdf, developer, etc.)
│   │       ├── [tool-type]/
│   │       │   ├── [specific-tool]/
│   │       │   │   ├── [ToolName].tsx
│   │       │   │   ├── index.ts
│   │       │   │   ├── metadata.ts
│   │       │   │   └── types.ts
│   │       │   ├── registry.ts
│   │       │   ├── index.ts
│   │       │   └── types.ts
│   │       └── index.ts     # Combined exports
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Tool, ToolCategory, RoutePath types
│
├── public/                  # Static assets served as-is
├── templates/               # Tool template for generating new tools
├── docs/                    # Documentation
├── dist/                    # Production build output (generated)
├── node_modules/            # Dependencies (generated)
│
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── bun.lock                 # Bun lockfile (unused, using npm)
├── package-lock.json        # NPM lockfile
├── README.md                # Project README
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── PROJECT_REVIEW.md        # This file - project knowledge base
```

## 🔧 Key Configurations

### package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit",
    "test": "jest"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3",
    "@types/express": "^4.17.21",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```

## 🐞 Issues Found & Fixes Applied

### 1. TypeScript Version Mismatch
- **Issue**: Template had `"typescript": "^7.0.2"` which doesn't exist
- **Fix**: Changed to `"typescript": "^5.9.3"` in package.json
- **Files Modified**: package.json

### 2. Vite __dirname Deprecation Warning
- **Issue**: Using `__dirname` in vite.config.ts which is deprecated
- **Fix**: Replaced with `new URL('.', import.meta.url).pathname`
- **Files Modified**: vite.config.ts

### 3. Unused @ts-expect-error Directive
- **Issue**: Unused TS directive in IconHelper.tsx causing TS error
- **Fix**: Removed the unused `@ts-expect-error` comment
- **Files Modified**: src/components/ui/IconHelper.tsx

### 4. Dependency Conflicts
- **Issue**: esbuild version conflict between root project and Vite
- **Fix**: Used `--legacy-peer-deps` flag during npm install
- **Command**: `npm install --legacy-peer-deps --no-audit --no-fund`

## ✅ Build & Development Status

### Build Status: ✅ PASSING
- Command: `npm run build`
- Output: Successfully builds with minor chunk size warnings (optimization opportunity)
- Last Build: ~700ms, 1.09MB JS bundle

### Type Checking: ✅ PASSING
- Command: `npx tsc --noEmit`
- Output: No TypeScript errors

### Development Server: ⚠️ NOT TESTED
- Command: `npm run dev`
- Note: Requires environment variables from .env.example

### Testing: ✅ PASSING
- Command: `npm test` (jest)
- Status: All 3 test suites pass (3 tests)
- Files with tests:
  - src/features/tools/image/image-compressor/tests/
  - templates/tool/tests/

## 🧩 Component Architecture

### Routing (App.tsx)
- Single file router using useState for currentPath
- Handles routes: home, tools, categories, static pages, tool pages, not found
- Implements theme persistence (dark/light) via localStorage
- Keyboard shortcut: Cmd/Ctrl+K for search modal
- Scroll to top on navigation

### Key Components
- **ToolCard**: Reusable tool preview card with hover effects
- **ToolSearch**: Search/filter component for tools
- **ToolPageShell**: Wrapper for individual tool pages
- **ToolWorkspace**: Phased implementation placeholder for tools
- **UI Primitives**: Button, Card, Container, Badge, Breadcrumbs, IconHelper
- **Layout**: Navbar, Footer, MobileBottomBar, SearchModal

### Data Flow
1. Static data in src/data/categories.ts and src/data/tools.ts
2. Exported via src/data/tools/index.ts and src/features/tools/index.ts
3. Consumed by components via imports like `import { TOOLS } from '../../data/tools'`
4. Individual tools loaded lazily via `getToolModuleBySlug`

## 📦 Tool System

### Tool Types (ToolCategorySlug)
- image, images, pdf, developer, text, calculator, calculators, social, converter, downloader, seo, privacy, productivity, more

### Tool Interface (src/types/index.ts)
```typescript
export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategorySlug;
  iconName: string;
  iconBg: string;
  iconColor: string;
  status: 'available' | 'coming-soon';
  featured?: boolean;
  popular?: boolean;
  filterType?: ToolFilterType;
  tags?: string[];
  features?: string[];
  howItWorks?: { step: number; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}
```

### Tool Loading Mechanism
- Individual tools in src/features/tools/[type]/[tool-name]/
- Each tool exports Component, metadata, and types
- Registry system collects all tools into TOOLS array
- getToolBySlug() and getToolsByCategory() for lookup

## 📝 Templates System
Location: src/templates/
Purpose: Boilerplate for generating new tools
Contains:
- ToolComponent.tsx (base component)
- config.ts (configuration)
- hooks/useTool.ts (tool-specific hooks)
- lib/engine.ts (processing logic)
- types.ts (tool-specific types)
- utils/tool-utils.ts (utility functions)
- README.md (documentation)
- tests/ (unit tests - needs jest setup)

## 🧪 Testing Status
- **Framework**: Jest (configured in package.json)
- **Issue**: Tests ReferenceError: describe is not defined
- **Root Cause**: Missing jest setup/jsdom environment
- **Files with Tests**:
  - src/features/tools/image/image-compressor/tests/compressor.test.ts
  - src/features/tools/image/image-compressor/tests/validation.test.ts
  - templates/tool/tests/tool.test.ts
- **Fix Needed**: Add jest.config.js or configure in package.json

## 🚀 Development Commands
```bash
# Install dependencies (with legacy peer deps to resolve conflicts)
npm install --legacy-peer-deps --no-audit --no-fund

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean

# Type checking
npm run lint

# Run tests (currently broken - needs setup)
npm test
```

## 🔍 Known Improvements/TODOs

### Performance
- [ ] Code-splitting for large chunks (>500kB warning)
- [ ] Lazy load heavy tool components
- [ ] Optimize image assets

### Testing
- [ ] Fix Jest setup for existing tests
- [ ] Add more unit/tool tests
- [ ] Add e2e testing (Cypress/Playwright)

### Tool Completion
- [ ] Implement actual tool logic in ToolWorkspace components
- [ ] Add more tools to each category
- [ ] Complete metadata for all tools

### DX Improvements
- [ ] Add prettier/formatting configuration
- [ ] Add commit linting
- [ ] Add GitHub Actions CI/CD
- [ ] Add storybook for UI components

### Documentation
- [ ] Expand README with usage instructions
- [ ] Add API documentation for tool developers
- [ ] Add contributing guidelines

## 📜 Maintenance Rules

### When Making Changes:
1. **Update this file** - Any significant change to project structure, dependencies, or configuration must be documented here
2. **Note the fix** - When resolving issues, document what was wrong and how it was fixed
3. **Version awareness** - Keep track of dependency versions in package.json section
4. **Before major tasks** - Break down into subtasks and document approach here

### File Update Format:
```
### [DATE] - [DESCRIPTION]
- **Issue**: What problem was encountered
- **Fix**: How it was resolved
- **Files**: List of files modified
- **Commands**: Any relevant commands run
```

### Initial State Recorded: 
- TypeScript: 5.9.3 (updated from invalid 7.0.2)
- Vite config: Fixed __dirname usage
- Build: Passing with minor warnings
- Lint: Passing
- Tests: Broken (Jest setup needed)

### 2026-09-23 - Created project knowledge base
- **Issue**: Need centralized documentation for project structure, dependencies, and known issues
- **Fix**: Created PROJECT_REVIEW.md with comprehensive project overview
- **Files**: PROJECT_REVIEW.md
- **Commands**: None (file creation)

### 2026-09-25 - Foundation hardening phase
- **Issue**: Jest environment was incomplete; tests failed with `describe is not defined`
- **Fix**: Configured Jest with jsdom, ts-jest TypeScript support, `@/` module alias resolution, and `@testing-library/jest-dom` setup. `npm test` now passes.
- **Files**: jest.config.cjs, jest.setup.cjs, package.json, package-lock.json
- **Commands**: `npm test`, `npm run lint`, `npm run build`

### 2026-09-25 - Image-first production foundation
- **Issue**: All image tool modules were statically imported, causing every tool implementation to be bundled into the initial 1MB+ JavaScript payload. Unfinished/coming-soon tools were exposed as active searchable tools.
- **Fix**: Removed static tool exports from `src/features/tools/image/index.ts`, rebuilt the image registry around lazy dynamic import loaders, limited the active tool registry to implemented production-ready tools, and updated `src/data/tools/image.ts` to consume the active registry instead of raw tool modules.
- **Files**: src/features/tools/image/index.ts, src/features/tools/image/registry.ts, src/features/tools/registry.ts, src/data/tools/image.ts
- **Commands**: `npm test`, `npm run lint`, `npm run build`