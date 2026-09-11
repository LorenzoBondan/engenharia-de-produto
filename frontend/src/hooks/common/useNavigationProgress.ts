import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface UseNavigationProgressReturn {
  isNavigating: boolean;
}

export function useNavigationProgress(): UseNavigationProgressReturn {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show loading indicator when location changes
    setIsNavigating(true);

    // Add a small delay to prevent flash for fast navigations
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return { isNavigating };
}
