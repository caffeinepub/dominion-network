import { ReactNode } from 'react';
import { useAdminStatus } from '../hooks/useAdminStatus';
import { AdminAccessDenied } from './AdminAccessDenied';
import { Loader2 } from 'lucide-react';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, canShowAdminUI, isAdminLoading } = useAdminStatus();

  // Show loading only when authenticated and checking admin status
  if (isAuthenticated && isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied immediately for non-authenticated or non-admin users
  if (!canShowAdminUI) {
    return <AdminAccessDenied />;
  }

  return <>{children}</>;
}
