import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

export interface RouterOptions {
  initialRoute?: string;
}

export interface ProviderOptions extends RouterOptions {
  // Add other provider options here as needed
}

/**
 * Render component with React Router context
 */
export function renderWithRouter(
  ui: React.ReactElement,
  options?: RouterOptions
): RenderResult {
  const { initialRoute = '/' } = options || {};

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper });
}

/**
 * Render component with all necessary providers (Router, etc.)
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: ProviderOptions
): RenderResult {
  const { initialRoute = '/' } = options || {};

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialRoute]}>
      {/* Add other providers here as needed */}
      {children}
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper });
}
