import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';

export function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md border-red-500/20 bg-slate-800/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl text-white">Access Denied</CardTitle>
          <CardDescription className="text-slate-300">
            You do not have permission to access this admin area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400 text-center">
            This section is restricted to administrators only. If you believe you should have access, please contact your system administrator.
          </p>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
