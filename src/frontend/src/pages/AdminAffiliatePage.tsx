import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllAffiliateTiers, useCreateAffiliateTier } from '../hooks/useQueries';
import { Loader2, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function AdminAffiliatePage() {
  const { data: tiers = [], isLoading } = useGetAllAffiliateTiers();
  const createTier = useCreateAffiliateTier();

  const [formData, setFormData] = useState({
    name: '',
    commissionRate: '',
    minReferrals: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTier.mutateAsync({
        name: formData.name,
        commissionRate: BigInt(formData.commissionRate),
        minReferrals: BigInt(formData.minReferrals),
      });
      setFormData({
        name: '',
        commissionRate: '',
        minReferrals: '',
      });
    } catch (error) {
      console.error('Failed to create tier:', error);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Affiliate Program Management</h1>
        <p className="text-muted-foreground">Configure commission tiers and manage affiliate program settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Tier
          </CardTitle>
          <CardDescription>Add a new commission tier for affiliates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tier Name</Label>
              <Input
                id="name"
                placeholder="e.g., Bronze, Silver, Gold"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 10"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minReferrals">Minimum Referrals</Label>
                <Input
                  id="minReferrals"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={formData.minReferrals}
                  onChange={(e) => setFormData({ ...formData, minReferrals: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={createTier.isPending}>
              {createTier.isPending ? 'Creating...' : 'Create Tier'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Tiers</CardTitle>
          <CardDescription>All configured affiliate commission tiers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tiers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tiers configured yet</p>
          ) : (
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div key={tier.id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {tier.name}
                    </h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Commission: {Number(tier.commissionRate)}%</span>
                      <span>Min Referrals: {Number(tier.minReferrals)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
