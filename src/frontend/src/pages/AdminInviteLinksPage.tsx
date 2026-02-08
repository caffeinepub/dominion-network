import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Plus, Check, Link as LinkIcon } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { InviteCode } from '../backend';

export function AdminInviteLinksPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: inviteCodes = [], isLoading } = useQuery<InviteCode[]>({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInviteCodes();
    },
    enabled: !!actor,
  });

  const generateInviteCode = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateInviteCode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes'] });
      toast.success('New invite code generated!');
    },
    onError: (error: any) => {
      toast.error(`Failed to generate code: ${error.message}`);
    },
  });

  const copyToClipboard = (code: string) => {
    const inviteUrl = `${window.location.origin}/admin/invite-accept?token=${code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const availableCodes = inviteCodes.filter((code) => !code.used);
  const usedCodes = inviteCodes.filter((code) => code.used);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <LinkIcon className="h-8 w-8" />
            Admin Invite Links
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage invitation links for new administrators
          </p>
        </div>
        <Button
          onClick={() => generateInviteCode.mutate()}
          disabled={generateInviteCode.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate New Code
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Available Invite Codes</CardTitle>
            <CardDescription>
              {availableCodes.length} unused invitation{availableCodes.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : availableCodes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No available codes. Generate a new one!
              </p>
            ) : (
              <div className="space-y-3">
                {availableCodes.map((code) => (
                  <div
                    key={code.code}
                    className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {code.code}
                      </code>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(Number(code.created) / 1000000).toLocaleDateString()}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => copyToClipboard(code.code)}
                    >
                      {copiedCode === code.code ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Invite Link
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Used Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Used Invite Codes</CardTitle>
            <CardDescription>
              {usedCodes.length} redeemed invitation{usedCodes.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : usedCodes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No codes have been used yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {usedCodes.map((code) => (
                  <div
                    key={code.code}
                    className="p-4 border rounded-lg space-y-2 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {code.code}
                      </code>
                      <Badge variant="outline">Used</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(Number(code.created) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Invite Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Click "Generate New Code" to create a new invitation link</p>
          <p>2. Click "Copy Invite Link" to copy the full URL to your clipboard</p>
          <p>3. Share the link with the person you want to invite as an administrator</p>
          <p>4. They will need to log in with Internet Identity and use the link to gain admin access</p>
          <p>5. Each code can only be used once and will appear in the "Used" section after redemption</p>
        </CardContent>
      </Card>
    </div>
  );
}
