import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';
import { AdminAccessDenied } from './AdminAccessDenied';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsCallerAdmin();

  // Show loading state while initializing or checking admin status
  if (isInitializing || (identity && !isFetched)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mx-auto" />
          <p className="text-sm sm:text-base text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show access denied
  if (!identity) {
    return <AdminAccessDenied />;
  }

  // Authenticated but not admin - show access denied
  if (isAdmin !== true) {
    return <AdminAccessDenied />;
  }

  // Admin user - render protected content
  return <>{children}</>;
}
