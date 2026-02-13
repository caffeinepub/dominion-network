import { useIsCallerAdmin } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { useEffect } from 'react';

/**
 * Centralized admin status hook that provides a single source of truth
 * for admin UI visibility and access control across the application.
 * 
 * This hook ensures consistent behavior between AdminRouteGuard and Header
 * by combining identity state with admin status checks.
 */
export function useAdminStatus() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, refetch, isFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || (isAuthenticated && isAdminLoading);

  // Refetch admin status when identity becomes available
  useEffect(() => {
    if (identity && !isAdminLoading && !isFetched) {
      refetch();
    }
  }, [identity, isAdminLoading, isFetched, refetch]);

  // Admin UI should only show when:
  // 1. User is authenticated
  // 2. Admin status check has completed
  // 3. User is confirmed as admin
  const canShowAdminUI = isAuthenticated && !isLoading && isAdmin === true;

  return {
    isAdmin: isAdmin === true,
    isAdminLoading: isLoading,
    canShowAdminUI,
    isAuthenticated,
    refetchAdminStatus: refetch,
  };
}
