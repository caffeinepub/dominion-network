import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function AdminInviteAcceptPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'needsLogin'>('loading');
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const redeemInvite = useMutation({
    mutationFn: async (inviteToken: string) => {
      if (!actor || typeof (actor as any).redeemAdminInvite !== 'function') {
        toast.error('Invite redemption not available');
        throw new Error('Method not available');
      }
      return (actor as any).redeemAdminInvite(inviteToken);
    },
    onSuccess: () => {
      toast.success('Admin privileges granted successfully');
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: () => {
      toast.error('Failed to redeem invite link');
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('token');
    
    if (!inviteToken) {
      setStatus('error');
      return;
    }
    
    setToken(inviteToken);
    
    if (!identity) {
      setStatus('needsLogin');
      return;
    }
    
    // Auto-redeem if logged in
    handleRedeem(inviteToken);
  }, [identity]);

  const handleRedeem = async (inviteToken: string) => {
    try {
      setStatus('loading');
      await redeemInvite.mutateAsync(inviteToken);
      setStatus('success');
      setTimeout(() => {
        navigate({ to: '/admin/approvals' });
      }, 2000);
    } catch (error) {
      console.error('Failed to redeem invite:', error);
      setStatus('error');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      // After login, the useEffect will trigger redemption
    } catch (error) {
      console.error('Login failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Invitation</CardTitle>
          <CardDescription>
            You've been invited to become an administrator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Processing your invitation...</p>
            </div>
          )}

          {status === 'needsLogin' && (
            <div className="space-y-4">
              <Alert className="bg-primary/10 border-primary/30">
                <Shield className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Please log in with Internet Identity to accept this admin invitation.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Login to Accept Invitation
                  </>
                )}
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-green-500">Success!</h3>
                <p className="text-muted-foreground">
                  You now have admin privileges. Redirecting to admin dashboard...
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-destructive">Invalid Invitation</h3>
                <p className="text-muted-foreground">
                  This invitation link is invalid or has already been used.
                </p>
              </div>
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
