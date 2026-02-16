import { NavigateOptions } from '@tanstack/react-router';

/**
 * Navigate to an admin route and scroll to top after navigation completes.
 * This utility is specifically for admin menu navigation actions.
 */
export function navigateToAdminRoute(
  navigate: (opts: NavigateOptions) => void,
  route: string
): void {
  // Type assertion needed because route comes from dynamic admin nav items
  navigate({ to: route as any });
  
  // Scroll to top after navigation resolves (next tick)
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
}
