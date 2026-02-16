import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllAds, useCreateAd, useUpdateAd, useDeleteAd, useToggleAdActive } from '../hooks/useQueries';
import { useActorCapabilities } from '../hooks/useActorCapabilities';
import { AdminCapabilityNotice } from '../components/admin/AdminCapabilityNotice';
import { toast } from 'sonner';

export function AdminAdsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    targetUrl: '',
    placement: 'homepage',
    adType: 'banner',
  });

  const { data: ads = [], isLoading, error } = useGetAllAds();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();
  const toggleActive = useToggleAdActive();
  const capabilities = useActorCapabilities();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!capabilities.hasCreateAd && !editingAd) {
      toast.error('Ad creation is not available');
      return;
    }
    
    if (!capabilities.hasUpdateAd && editingAd) {
      toast.error('Ad update is not available');
      return;
    }

    try {
      if (editingAd) {
        await updateAd.mutateAsync({ ...formData, id: editingAd.id });
      } else {
        await createAd.mutateAsync(formData);
      }
      setIsCreateDialogOpen(false);
      setEditingAd(null);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: '',
        placement: 'homepage',
        adType: 'banner',
      });
    } catch (error: any) {
      console.error('Error saving ad:', error);
    }
  };

  const handleEdit = (ad: any) => {
    if (!capabilities.hasUpdateAd) {
      toast.error('Ad editing is not available');
      return;
    }
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      content: ad.content,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      placement: ad.placement.__kind__.toLowerCase(),
      adType: ad.adType.__kind__.toLowerCase(),
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    if (!capabilities.hasDeleteAd) {
      toast.error('Ad deletion is not available');
      return;
    }
    
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAd.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    if (!capabilities.hasToggleAdActive) {
      toast.error('Toggle ad status is not available');
      return;
    }
    
    try {
      await toggleActive.mutateAsync(id);
    } catch (error: any) {
      console.error('Error toggling ad:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <AdminCapabilityNotice type="error" message="Failed to load advertisements" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Advertisement Management</h1>
          <p className="text-muted-foreground">Create and manage advertisements across the platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!capabilities.hasCreateAd}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}</DialogTitle>
              <DialogDescription>
                {editingAd ? 'Update the advertisement details' : 'Fill in the details to create a new advertisement'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placement">Placement</Label>
                  <Select
                    value={formData.placement}
                    onValueChange={(value) => setFormData({ ...formData, placement: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">Homepage</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="mall">Mall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adType">Ad Type</Label>
                  <Select
                    value={formData.adType}
                    onValueChange={(value) => setFormData({ ...formData, adType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    type="url"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAd.isPending || updateAd.isPending}>
                  {createAd.isPending || updateAd.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingAd ? (
                    'Update Ad'
                  ) : (
                    'Create Ad'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
          <CardDescription>Manage all advertisements across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No advertisements created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id.toString()}>
                      <TableCell className="font-medium">{ad.title}</TableCell>
                      <TableCell className="capitalize">{ad.placement}</TableCell>
                      <TableCell className="capitalize">{ad.adType}</TableCell>
                      <TableCell>
                        <Badge variant={ad.active ? 'default' : 'secondary'}>
                          {ad.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{Number(ad.views).toLocaleString()}</TableCell>
                      <TableCell>{Number(ad.clicks).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(ad)}
                            disabled={!capabilities.hasUpdateAd}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(ad.id)}
                            disabled={!capabilities.hasDeleteAd || deleteAd.isPending}
                          >
                            {deleteAd.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
