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

### Step 8: Register in Family Registry
Add your tool module into `src/features/tools/[family]/registry.ts`:
```typescript
import * as SvgOptimizer from './svg-optimizer';

export const IMAGE_TOOL_MODULES: ToolModule[] = [
  // ...existing tools
  SvgOptimizer,
];
```

---

### Step 9: Automatic Route Resolution
The router automatically resolves the new tool at:
`/tools/image/svg-optimizer` and `/tools/svg-optimizer`.
Search, category listings, and related tools automatically discover the new tool through the master registry.

---

### Step 10: Test & Build
Run verification commands:
```bash
npm run lint
npm run build
```
Verify the tool opens seamlessly and renders with responsive layout and dark mode support.
