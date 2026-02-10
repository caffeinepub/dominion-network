import { useEffect, useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';
import { AdminAccessDenied } from './AdminAccessDenied';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, error, refetch } = useIsCallerAdmin();
  const [hasShownError, setHasShownError] = useState(false);

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || isAdminLoading;

  // Refetch admin status when identity changes
  useEffect(() => {
    if (identity && !isInitializing) {
      refetch();
    }
  }, [identity, isInitializing, refetch]);

  useEffect(() => {
    if (error && !hasShownError) {
      console.error('Admin check error:', error);
      setHasShownError(true);
    }
  }, [error, hasShownError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Explicitly check for admin status
  if (!isAuthenticated || isAdmin !== true) {
    return <AdminAccessDenied />;
  }

  return <>{children}</>;
}
