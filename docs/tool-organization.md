# Zorli Tool Organization & Family Structure

## Directory Layout
```
src/
├── features/
│   └── tools/
│       ├── types.ts                     # Shared tool module & registry interfaces
│       ├── common/                      # Common tool workspace layout components
│       │   └── ToolWorkspace.tsx
│       ├── registry.ts                  # Master registry combining all families
│       │
│       ├── image/                       # Image Family
│       │   ├── image-compressor/        # Flagship isolated tool
│       │   ├── image-resizer/
│       │   ├── image-converter/
│       │   ├── ...
│       │   ├── registry.ts
│       │   └── index.ts
│       │
│       ├── pdf/                         # PDF Family
│       ├── developer/                   # Developer Family
│       ├── text/                        # Text Family
│       ├── calculator/                  # Calculator Family
│       ├── social/                      # Social Family
│       ├── converter/                   # Converter Family
│       ├── downloader/                  # Downloader Family
│       ├── seo/                         # SEO Family
│       ├── privacy/                     # Privacy Family
│       └── productivity/                # Productivity Family
│
├── data/
│   ├── categories.ts                    # Centralized category definitions
│   └── tools/                           # Family data definitions
│       ├── image.ts
│       ├── pdf.ts
│       ├── developer.ts
│       ├── calculator.ts
│       ├── text.ts
│       ├── social.ts
│       └── index.ts
```

## Tool Isolation Rules
1. **Never place tool-specific processing in global directories**: A compressor algorithm belongs only in `image-compressor/lib/compressor.ts`.
2. **Never duplicate tools**: A tool has one single physical home. If it fits multiple categories, use metadata `tags` for cross-discovery.
3. **Always keep tools independently testable**: Tests are located right beside the tool code (`tests/`).
4. **Export a clean public interface**: Each tool exports `{ metadata, Component }` through its `index.ts`.
