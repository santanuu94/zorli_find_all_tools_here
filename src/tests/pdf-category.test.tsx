import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from '../App';
import { CATEGORIES, countAvailableCategoryTools, countCategoryTools } from '../data/categories';
import { getToolsByCategory, getActiveToolsByCategory } from '../data/tools';

describe('PDF Tools Family Landing Page (/tools/pdf)', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('PDF category exists in CATEGORIES registry with dynamic counts', () => {
    const pdfCategory = CATEGORIES.find((c) => c.slug === 'pdf');
    expect(pdfCategory).toBeDefined();
    expect(pdfCategory?.name).toBe('PDF Tools');
    expect(pdfCategory?.shortName).toBe('PDF');
    expect(pdfCategory?.toolsCount).toBe(countCategoryTools('pdf'));
    expect(pdfCategory?.availableToolsCount).toBe(countAvailableCategoryTools('pdf'));
    expect(pdfCategory?.availableToolsCount).toBe(1); // 1 active tool: PDF Compressor
  });

  test('getActiveToolsByCategory returns only available tools', () => {
    const activePdfTools = getActiveToolsByCategory('pdf');
    expect(activePdfTools.length).toBe(1);
    expect(activePdfTools[0].slug).toBe('pdf-compressor');

    const activeImageTools = getActiveToolsByCategory('images');
    expect(activeImageTools.length).toBe(6);
  });

  test('navigating directly to /tools/pdf renders the PDF Tools landing page with active tools', async () => {
    window.history.pushState({}, '', '/tools/pdf');
    render(<App />);

    // 1. Wait for lazy route to load
    const h1Heading = await screen.findByRole('heading', { level: 1, name: /PDF\s+Tools/i }, { timeout: 5000 });
    expect(h1Heading).toBeInTheDocument();
    expect(screen.getByText(/Simple tools to compress, merge, split, organize and work with PDF files/i)).toBeInTheDocument();

    // 2. Breadcrumbs: Home / Tools / PDF
    const breadcrumbNav = screen.getByLabelText('Breadcrumb');
    expect(within(breadcrumbNav).getByText('Home')).toBeInTheDocument();
    expect(within(breadcrumbNav).getByText('Tools')).toBeInTheDocument();
    expect(within(breadcrumbNav).getByText('PDF')).toBeInTheDocument();

    // 3. Document title & canonical
    expect(document.title).toBe('PDF Tools - Free Online PDF Utilities | Zorli');
    const canonicalLink = document.querySelector("link[rel='canonical']");
    expect(canonicalLink?.getAttribute('href')).toBe('https://zorli.pages.dev/tools/pdf');

    // 4. PDF Compressor card automatically appears in the grid
    expect(screen.getByText('PDF Compressor')).toBeInTheDocument();
    expect(screen.getByText(/1 tool available/i)).toBeInTheDocument();

    // 5. Semantic SEO Content Sections
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    const h2Titles = h2Headings.map((h) => h.textContent?.trim());
    expect(h2Titles).toContain('PDF Tools');
    expect(h2Titles).toContain('Choose the PDF tool you need');
  });

  test('navigating directly to /tools/pdf/pdf-compressor renders the PDF Compressor tool page', async () => {
    window.history.pushState({}, '', '/tools/pdf/pdf-compressor');
    render(<App />);

    const h1Heading = await screen.findByRole('heading', { level: 1, name: /PDF\s+Compressor/i }, { timeout: 5000 });
    expect(h1Heading).toBeInTheDocument();
    expect(document.title).toBe('PDF Compressor - Compress PDF to a Smaller Size | Zorli');

    // Dropzone prompt (loaded via async dynamic import)
    const dropzonePrompt = await screen.findByText('Drag & Drop PDF', {}, { timeout: 5000 });
    expect(dropzonePrompt).toBeInTheDocument();
    expect(screen.getByText('Select PDF File')).toBeInTheDocument();
  });

  test('navigating to /tools/image still renders the Image Tools landing page with 6 active tools', async () => {
    window.history.pushState({}, '', '/tools/image');
    render(<App />);

    const h1Heading = await screen.findByRole('heading', { level: 1, name: /Image\s+Tools/i }, { timeout: 5000 });
    expect(h1Heading).toBeInTheDocument();
    expect(screen.getByText(/6 tools available/i)).toBeInTheDocument();

    // Active image tool cards are present
    expect(screen.getByText('Image Compressor')).toBeInTheDocument();
    expect(screen.getByText('Image Resizer')).toBeInTheDocument();
    expect(screen.getByText('Image Converter')).toBeInTheDocument();
    expect(screen.getByText('Image Cropper')).toBeInTheDocument();
    expect(screen.getByText('Image Metadata Cleaner')).toBeInTheDocument();
    expect(screen.getByText('Image Background Remover')).toBeInTheDocument();
  });
});
