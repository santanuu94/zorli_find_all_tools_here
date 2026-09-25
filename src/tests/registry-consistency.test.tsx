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
    expect(searchTools('compressor').map((tool) => tool.slug)).toEqual(['image-compressor']);
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

    expect(await screen.findByRole('heading', { level: 1, name: /Explore All\s+Tools/i })).toBeInTheDocument();
    expect(screen.getByText('Image Compressor')).toBeInTheDocument();
  });

  test('deep link to a coming-soon tool shows the honest placeholder, not a working tool', async () => {
    window.history.pushState({}, '', '/tools/image/image-compressor');
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Image Compressor' })).toBeInTheDocument();
    expect(screen.getByText(/is not available yet/i)).toBeInTheDocument();
    // The fabricated success state must never be reachable.
    expect(screen.queryByText(/-55%/)).not.toBeInTheDocument();
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
