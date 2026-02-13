import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllAffiliateTiers, useCreateAffiliateTier } from '../hooks/useQueries';
import { AdminCapabilityNotice } from '../components/admin/AdminCapabilityNotice';
import { toast } from 'sonner';

export function AdminAffiliatePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    commissionRate: '',
    minReferrals: '',
  });

  const { data: tiers = [], isLoading, error } = useGetAllAffiliateTiers();
  const createTier = useCreateAffiliateTier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTier.mutateAsync({
        name: formData.name,
        commissionRate: parseInt(formData.commissionRate),
        minReferrals: parseInt(formData.minReferrals),
      });
      setIsCreateDialogOpen(false);
      setFormData({ name: '', commissionRate: '', minReferrals: '' });
    } catch (error: any) {
      console.error('Error creating tier:', error);
      toast.error('Failed to create affiliate tier');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminCapabilityNotice
          type="error"
          message="Failed to load affiliate tiers. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Program Management</h1>
          <p className="text-muted-foreground">Create and manage commission tiers for affiliates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Affiliate Tier</DialogTitle>
              <DialogDescription>
                Define a new commission tier for your affiliate program.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tier Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bronze, Silver, Gold"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minReferrals">Minimum Referrals</Label>
                  <Input
                    id="minReferrals"
                    type="number"
                    min="0"
                    value={formData.minReferrals}
                    onChange={(e) => setFormData({ ...formData, minReferrals: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTier.isPending}>
                  {createTier.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Tier
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tiers.length === 0 ? (
        <AdminCapabilityNotice
          type="empty"
          message="No affiliate tiers found. Create your first tier to get started with the affiliate program."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Tiers</CardTitle>
            <CardDescription>Manage commission rates and requirements for each tier</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Minimum Referrals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier: any) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.name}</TableCell>
                    <TableCell>{Number(tier.commissionRate)}%</TableCell>
                    <TableCell>{Number(tier.minReferrals)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
