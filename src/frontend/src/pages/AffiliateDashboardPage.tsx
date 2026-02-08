import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, TrendingUp, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useGenerateReferralLink, useGetUserReferralLink, useGetAllAffiliateTiers } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function AffiliateDashboardPage() {
  const navigate = useNavigate();
  const generateLink = useGenerateReferralLink();
  const { data: existingLink } = useGetUserReferralLink();
  const { data: tiers } = useGetAllAffiliateTiers();
  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    if (existingLink) {
      const link = `${window.location.origin}?ref=${existingLink.code}`;
      setReferralLink(link);
    }
  }, [existingLink]);

  const handleGenerateLink = async () => {
    try {
      const result = await generateLink.mutateAsync();
      const link = `${window.location.origin}?ref=${result.code}`;
      setReferralLink(link);
    } catch (error) {
      console.error('Failed to generate link:', error);
    }
  };

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    }
  };

  const currentTier = tiers && existingLink 
    ? tiers.find(t => Number(existingLink.conversions) >= Number(t.minReferrals))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Affiliate Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your referrals and blockchain-verified earnings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Referral Link
              </CardTitle>
              <CardDescription>Generate and share your unique link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!referralLink ? (
                <Button onClick={handleGenerateLink} disabled={generateLink.isPending} className="w-full">
                  {generateLink.isPending ? 'Generating...' : 'Generate Referral Link'}
                </Button>
              ) : (
                <>
                  <div className="p-3 bg-muted rounded-lg break-all text-sm">
                    {referralLink}
                  </div>
                  <Button onClick={handleCopyLink} variant="outline" className="w-full gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Statistics
              </CardTitle>
              <CardDescription>Your referral performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingLink ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{existingLink.views.toString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold">{existingLink.clicks.toString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold text-green-500">{existingLink.conversions.toString()}</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">Generate a link to start tracking</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-primary" />
                Current Tier
              </CardTitle>
              <CardDescription>Your commission tier and earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTier ? (
                <>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {currentTier.name}
                    </Badge>
                    <p className="text-3xl font-bold text-primary">{currentTier.commissionRate.toString()}%</p>
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Blockchain-Verified Earnings</p>
                    <p className="text-sm font-medium">Coming Soon</p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Start referring to unlock commission tiers
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
