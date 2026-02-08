import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';

export function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 px-4">
      <Card className="max-w-md w-full bg-card/50 backdrop-blur border-destructive/30">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You do not have permission to access this admin area. Only administrators can view this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full gap-2"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Return to Home
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            If you believe you should have access, please contact an administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
