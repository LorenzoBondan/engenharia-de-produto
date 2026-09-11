import { vi } from 'vitest';
import * as ReactRouter from 'react-router-dom';

/**
 * Mock the useNavigate hook and return a spy function
 */
export function mockUseNavigate() {
  const navigate = vi.fn();
  vi.mocked(ReactRouter.useNavigate).mockReturnValue(navigate);
  return navigate;
}

/**
 * Mock the useParams hook with provided parameters
 */
export function mockUseParams(params: Record<string, string>): void {
  vi.mocked(ReactRouter.useParams).mockReturnValue(params);
}

/**
 * Mock the useLocation hook with location state
 */
export function mockUseLocation(location: Partial<ReactRouter.Location>): void {
  const defaultLocation: ReactRouter.Location = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
    ...location,
  };

  vi.mocked(ReactRouter.useLocation).mockReturnValue(defaultLocation);
}
