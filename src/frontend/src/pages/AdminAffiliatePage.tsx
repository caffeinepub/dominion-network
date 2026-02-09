import { useState } from 'react';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { useGetAffiliateTiers, useCreateAffiliateTier } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AdminAffiliatePage() {
  const navigate = useNavigate();
  const { data: tiers, isLoading } = useGetAffiliateTiers();
  const createTier = useCreateAffiliateTier();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [minReferrals, setMinReferrals] = useState('');

  const handleCreate = async () => {
    const rate = parseInt(commissionRate);
    const refs = parseInt(minReferrals);

    if (!name || isNaN(rate) || isNaN(refs) || rate < 0 || rate > 100 || refs < 0) {
      return;
    }

    await createTier.mutateAsync({
      name,
      commissionRate: BigInt(rate),
      minReferrals: BigInt(refs),
    });

    setName('');
    setCommissionRate('');
    setMinReferrals('');
    setIsCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Manage Affiliate Program</h1>
              <p className="text-muted-foreground mt-1">Configure tiers and track referrals with blockchain integration</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Tier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Affiliate Tier</DialogTitle>
                <DialogDescription>Add a new commission tier for affiliates</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Bronze, Silver, Gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Commission Rate (%)</Label>
                  <Input
                    id="rate"
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refs">Minimum Referrals</Label>
                  <Input
                    id="refs"
                    type="number"
                    min="0"
                    value={minReferrals}
                    onChange={(e) => setMinReferrals(e.target.value)}
                    placeholder="e.g., 5"
                  />
                </div>
                <Button onClick={handleCreate} disabled={createTier.isPending} className="w-full">
                  {createTier.isPending ? 'Creating...' : 'Create Tier'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Affiliate Tiers
            </CardTitle>
            <CardDescription>Commission tiers with blockchain-tracked earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading tiers...</p>
            ) : tiers && tiers.length > 0 ? (
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id.toString()} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Minimum {tier.minReferrals.toString()} referrals required
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{tier.commissionRate.toString()}%</p>
                      <p className="text-xs text-muted-foreground">Commission Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No tiers yet. Create your first tier to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
