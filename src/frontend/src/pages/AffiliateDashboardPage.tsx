import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGenerateReferralLink, useGetUserReferralLink, useGetAllAffiliateTiers } from '../hooks/useQueries';
import { Copy, Share2, TrendingUp, Users, MousePointerClick, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AffiliateDashboardPage() {
  const { data: referralLink, isLoading: linkLoading } = useGetUserReferralLink();
  const { data: tiers = [], isLoading: tiersLoading } = useGetAllAffiliateTiers();
  const generateLink = useGenerateReferralLink();

  const [referralUrl, setReferralUrl] = useState('');

  useEffect(() => {
    if (referralLink) {
      const baseUrl = window.location.origin;
      setReferralUrl(`${baseUrl}?ref=${referralLink}`);
    }
  }, [referralLink]);

  const handleGenerateLink = async () => {
    try {
      await generateLink.mutateAsync();
    } catch (error) {
      console.error('Failed to generate referral link:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success('Referral link copied to clipboard!');
  };

  const getCurrentTier = () => {
    if (!referralLink || tiers.length === 0) return null;
    // Since referralLink is just a string (code), we can't get conversions
    // Return the first tier as default
    return tiers[0] || null;
  };

  const currentTier = getCurrentTier();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Track your referrals and earn commissions</p>
        </div>

        {linkLoading || tiersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !referralLink ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started with Affiliate Program</CardTitle>
              <CardDescription>Generate your unique referral link to start earning commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateLink} disabled={generateLink.isPending}>
                {generateLink.isPending ? 'Generating...' : 'Generate Referral Link'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4" />
                    Total Clicks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentTier ? `${Number(currentTier.commissionRate)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Commission Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>Share this link to earn commissions on referrals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralUrl} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                {currentTier && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current Tier:</span>
                    <Badge variant="secondary" className="text-sm">
                      {currentTier.name} - {Number(currentTier.commissionRate)}% Commission
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Tiers</CardTitle>
                <CardDescription>Earn higher commissions as you refer more users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id.toString()}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">{tier.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {Number(tier.minReferrals)}+ referrals required
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {Number(tier.commissionRate)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
