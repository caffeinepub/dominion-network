import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, TrendingUp, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useGenerateReferralLink, useGetReferralLink, useGetAffiliateTiers } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function AffiliateDashboardPage() {
  const navigate = useNavigate();
  const generateLink = useGenerateReferralLink();
  const { data: existingLink } = useGetReferralLink();
  const { data: tiers } = useGetAffiliateTiers();
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
                <TrendingUp className="h-5 w-5 text-accent" />
                Statistics
              </CardTitle>
              <CardDescription>Your referral performance</CardDescription>
            </CardHeader>
            <CardContent>
              {existingLink ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-bold">{existingLink.views.toString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Clicks</span>
                    <span className="font-bold">{existingLink.clicks.toString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversions</span>
                    <span className="font-bold text-primary">{existingLink.conversions.toString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Generate a referral link to start tracking
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-orange-500" />
                Earnings
              </CardTitle>
              <CardDescription>Blockchain-verified commissions</CardDescription>
            </CardHeader>
            <CardContent>
              {currentTier ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Tier</span>
                    <Badge variant="outline" className="text-primary border-primary">
                      {currentTier.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Commission Rate</span>
                    <span className="font-bold text-primary">{currentTier.commissionRate.toString()}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    All earnings are tracked on the Bitcoin blockchain and require admin approval for payout.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Complete referrals to unlock commission tiers
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {tiers && tiers.length > 0 && (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Available Tiers</CardTitle>
              <CardDescription>Unlock higher commission rates with more referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id.toString()}
                    className={`p-4 rounded-lg border ${
                      currentTier?.id === tier.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted bg-muted'
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">{tier.commissionRate.toString()}%</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.minReferrals.toString()} referrals required
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
