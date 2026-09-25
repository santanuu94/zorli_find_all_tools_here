# Adding a New Tool to Zorli

This guide explains the step-by-step procedure for adding an independent tool to the Zorli platform.

---

### Step 1: Choose the Primary Family
Identify the single primary tool family for the tool (e.g., `image`, `pdf`, `developer`, `text`, `calculator`, `social`, `converter`, `downloader`, `seo`, `privacy`, `productivity`).
*Note: If a tool could conceptually belong to multiple categories (e.g. HEIC to JPG), choose its primary family (`image`) and add secondary tags (`["converter", "apple"]`) for cross-discovery.*

---

### Step 2: Create the Tool Feature Folder
Copy from `/templates/tool/` or create a new folder under:
`src/features/tools/[family]/[tool-slug]/`

Example for SVG Optimizer:
`src/features/tools/image/svg-optimizer/`

---

### Step 3: Create Tool Configuration (`config.ts`)
Define the tool metadata, features, step-by-step instructions, and FAQs:
```typescript
import { Tool } from '../../../../types';

export const svgOptimizerConfig: Tool = {
  slug: 'svg-optimizer',
  name: 'SVG Optimizer',
  description: 'Clean and minify SVG markup removing metadata bloat.',
  category: 'images',
  iconName: 'Code',
  iconBg: 'bg-emerald-500/10',
  iconColor: '#10B981',
  status: 'available',
  featured: true,
  tags: ['svg', 'minify', 'clean', 'vector'],
  features: [
    'Removes redundant XML attributes and editor metadata',
    'Preserves path accuracy and viewboxes',
  ],
  howItWorks: [
    { step: 1, title: 'Upload SVG', description: 'Drop your SVG file or paste markup.' },
    { step: 2, title: 'Configure Precision', description: 'Select decimal rounding accuracy.' },
    { step: 3, title: 'Download Clean SVG', description: 'Copy or download optimized SVG.' },
  ],
  faqs: [
    { question: 'Is SVG optimization lossless?', answer: 'Yes, visual output remains identical.' },
  ],
};

export const metadata = svgOptimizerConfig;
```

---

### Step 4: Create Tool UI Components (`components/`)
Build the tool UI within `components/`. Wrap your main workspace inside the shared `<ToolWorkspace>`:
```tsx
import React from 'react';
import { ToolComponentProps } from '../../../types';
import { ToolWorkspace } from '../../../common/ToolWorkspace';

export const SvgOptimizer: React.FC<ToolComponentProps> = () => {
  return (
    <ToolWorkspace title="SVG Code Optimizer">
      <div>...</div>
    </ToolWorkspace>
  );
};
```

---

### Step 5: Create Processing Logic (`lib/`)
Keep client-side calculations, parsers, and engines in `lib/`:
`src/features/tools/image/svg-optimizer/lib/optimizer.ts`

---

### Step 6: Create Tests (`tests/`)
Add unit tests verifying edge cases and processing logic:
`src/features/tools/image/svg-optimizer/tests/optimizer.test.ts`

---

### Step 7: Export from Tool Feature Index (`index.ts`)
```typescript
export * from './config';
export { SvgOptimizer, SvgOptimizer as Component } from './components/SvgOptimizer';
```

---

### Step 8: Register the tool (three places, all required)

Registration is explicit — adding the module to a family registry on its own does
**not** make a tool live.

**8a. Family registry** — `src/features/tools/[family]/registry.ts`:
```typescript
import * as SvgOptimizer from './svg-optimizer';

export const IMAGE_TOOL_MODULES: ToolModule[] = [
  // ...existing tools
  SvgOptimizer,
];
```

**8b. Mark it active** — same file. This is the single source of truth for what
is "live":
```typescript
export const ACTIVE_IMAGE_TOOL_SLUGS: string[] = [
  'svg-optimizer',
];
```
`ACTIVE_IMAGE_TOOL_METADATA` is derived from this list, so the catalogue's
`status` follows automatically. Set `status: 'available'` in the tool's own
`config.ts` so the source of truth agrees.

**8c. Add exactly one lazy loader** — `src/features/tools/registry.ts`:
```typescript
const TOOL_MODULE_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'svg-optimizer': () => import('./image/svg-optimizer'),
};
```
Without this the tool page renders the "not available yet" shell, because the
registry refuses to present a tool it cannot actually load.

> Tools that are not finished must stay **out** of `ACTIVE_IMAGE_TOOL_SLUGS` and
> must have **no** loader. They may still be listed in
> `COMING_SOON_IMAGE_TOOLS` so the roadmap is visible; they will render as
> `coming-soon` and be excluded from search-driven "available" claims. This keeps
> the bundle free of orphan chunks and stops the UI from over-promising.

---

### Step 9: Route resolution

Once the three registrations above are in place the router resolves the tool at
`/tools/image/svg-optimizer` and `/tools/svg-optimizer`, and search, category
listings and related tools pick it up from the master registry. If any of the
three steps is missing, the route falls through to the 404 page by design.

---

### Step 10: Test & Build
Run verification commands:
```bash
npm run lint
npm test
npm run build
```
Then inspect `dist/` to confirm your tool produced exactly one lazy chunk (and
that no chunk was produced for tools you did not activate).
Verify the tool opens seamlessly and renders with responsive layout and dark mode support.
