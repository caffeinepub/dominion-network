import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminAccessDenied } from './AdminAccessDenied';
import { useAdminStatus } from '../hooks/useAdminStatus';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isAdmin, isAdminLoading, refetchAdminStatus } = useAdminStatus();

  // Refetch admin status when component mounts or identity changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchAdminStatus();
    }
  }, [isAuthenticated, refetchAdminStatus]);

  // Show loading only when authenticated and checking admin status
  if (isAuthenticated && isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-authenticated or non-admin users
  if (!isAuthenticated || !isAdmin) {
    return <AdminAccessDenied />;
  }

  return <>{children}</>;
}
