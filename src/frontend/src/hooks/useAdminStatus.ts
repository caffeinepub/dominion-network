import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useAdminStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity && !isInitializing;

  const { data: isAdmin, isLoading: isAdminLoading, refetch } = useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        const result = await actor.isCallerAdmin();
        return result === true;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching && !isInitializing,
    retry: 1,
    staleTime: 30000,
    gcTime: 60000,
  });

  const canShowAdminUI = isAuthenticated && isAdmin === true;
  const isLoading = isInitializing || actorFetching || (isAuthenticated && isAdminLoading);

  return {
    isAuthenticated,
    isAdmin: isAdmin === true,
    canShowAdminUI,
    isAdminLoading: isLoading,
    refetchAdminStatus: refetch,
  };
}
