# Zorli Platform Architecture

## Overview
Zorli is an extensible, browser-based online tools platform designed to scale cleanly to hundreds of independent utilities across multiple tool families without navigational or maintainability friction.

## Core Architectural Principles

### 1. Feature/Domain-Based Architecture
Code is organized by functional domain rather than technical file types.
- **Bad**: Putting 100 tool components into a flat `components/` directory.
- **Good**: Grouping tools into dedicated family directories (`features/tools/[family]/[tool]/`).

### 2. Separation of Routing from Tool Logic
The application route handles:
- URL parsing (`/tools/[family]/[tool]`)
- SEO metadata and HTML tags
- Breadcrumbs and navigation
- Global platform page shell (`ToolPageShell.tsx`)

The tool feature handles:
- Tool-specific UI components (`components/`)
- Tool configuration and metadata (`config.ts`)
- Processing logic, engines, and validators (`lib/`)
- React state and lifecycle hooks (`hooks/`)
- Formatting utilities (`utils/`)
- Unit and integration tests (`tests/`)

### 3. Centralized Tool Registry Architecture
The platform consumes tools through a single source of truth:
- Individual family definitions: `src/data/tools/[family].ts`
- Combined master registry: `src/data/tools/index.ts` and `src/features/tools/registry.ts`
- Dynamic tool lookup helpers: `getToolBySlug()`, `getToolModuleBySlug()`, `getToolsByCategory()`, `searchTools()`

### 4. Dependency Isolation
- No cross-tool dependencies (e.g. Image Compressor never imports from PDF Merger).
- Shared design system components live in `src/components/ui/`.
- Platform layout components live in `src/components/layout/`.
- Tool-specific code stays strictly within its isolated directory.
