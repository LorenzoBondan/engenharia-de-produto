import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function that includes common providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: BrowserRouter, ...options });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };
