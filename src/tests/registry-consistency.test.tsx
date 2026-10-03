import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { TOOLS, getToolBySlug, getToolModuleBySlug, searchTools } from '../data/tools';
import { ACTIVE_TOOL_SLUGS } from '../features/tools';
import { CATEGORIES, countAvailableCategoryTools, countCategoryTools } from '../data/categories';

/**
 * Guards the production-consistency invariants for the tool registry.
 *
 * These assertions exist because the project previously shipped a tool that was
 * marked `available` while its processing engine was a stub, advertised tools
 * that had no implementation, and hardcoded category counts that did not match
 * the registry.
 */
describe('Tool registry consistency', () => {
  test('every "available" tool is present in the active registry', () => {
    TOOLS.filter((tool) => tool.status === 'available').forEach((tool) => {
      expect(ACTIVE_TOOL_SLUGS).toContain(tool.slug);
    });
  });

  test('no "available" tool lacks a lazy-loaded implementation', async () => {
    for (const slug of ACTIVE_TOOL_SLUGS) {
      const module = await getToolModuleBySlug(slug);
      expect(module?.Component).toBeDefined();
    }
  });

  test('catalogued tools never use slug-derived placeholder metadata', () => {
    TOOLS.forEach((tool) => {
      expect(tool.description).not.toMatch(/^Image tool:/);
      expect(tool.name).not.toBe(tool.slug);
      // A real display name is capitalised and never contains a raw hyphen-slug.
      expect(tool.name).not.toBe(tool.slug.replace(/-/g, ' '));
      expect(tool.iconName).toBeTruthy();
    });
  });

  test('category counts are derived from the registry', () => {
    CATEGORIES.forEach((category) => {
      expect(category.toolsCount).toBe(countCategoryTools(category.slug));
      expect(category.availableToolsCount).toBe(countAvailableCategoryTools(category.slug));
    });
  });

  test('search reaches the catalogue and never invents tools', () => {
    expect(searchTools('compressor').map((tool) => tool.slug)).toEqual(['image-compressor', 'pdf-compressor']);
    expect(searchTools('pdf compressor').map((tool) => tool.slug)).toEqual(['pdf-compressor']);
    expect(searchTools('resizer').map((tool) => tool.slug)).toEqual(['image-resizer']);
    expect(searchTools('converter').map((tool) => tool.slug)).toEqual(['image-converter']);
    expect(searchTools('cropper').map((tool) => tool.slug)).toEqual(['image-cropper']);
    expect(searchTools('metadata').map((tool) => tool.slug)).toEqual(['image-metadata-cleaner']);
    expect(searchTools('background').map((tool) => tool.slug)).toEqual(['image-background-remover']);
    expect(searchTools('pdf merger')).toEqual([]);
  });
});

describe('Deep-link routing', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('renders the tool catalogue when the URL is /tools', async () => {
    window.history.pushState({}, '', '/tools');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: /Explore All\s+Tools/i }, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText('Image Compressor')).toBeInTheDocument();
    expect(screen.getByText('Image Resizer')).toBeInTheDocument();
    expect(screen.getByText('Image Converter')).toBeInTheDocument();
    expect(screen.getByText('Image Cropper')).toBeInTheDocument();
    expect(screen.getByText('Image Metadata Cleaner')).toBeInTheDocument();
    expect(screen.getByText('Image Background Remover')).toBeInTheDocument();
  });

  test('deep link to active tool loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-compressor');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Compressor' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drop images here, or browse files/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('deep link to image-resizer loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-resizer');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Resizer' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drop images to resize, or browse/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('deep link to image-converter loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-converter');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Converter' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drop images to convert, or browse/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('deep link to image-cropper loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-cropper');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Cropper' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drop images to crop, or browse/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('deep link to image-metadata-cleaner loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-metadata-cleaner');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Metadata Cleaner' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drag & Drop Image/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('deep link to image-background-remover loads the working studio workspace', async () => {
    window.history.pushState({}, '', '/tools/image/image-background-remover');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Background Remover' }, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Drag & Drop Image/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText(/is not available yet/i)).not.toBeInTheDocument();
  });

  test('an unknown tool route falls through to the 404 page', async () => {
    window.history.pushState({}, '', '/tools/image/jpg-to-png');
    render(<App />);

    expect(getToolBySlug('jpg-to-png')).toBeUndefined();
    await waitFor(() => {
      expect(screen.queryByRole('heading', { level: 1, name: /Explore All\s+Tools/i })).not.toBeInTheDocument();
    });
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
