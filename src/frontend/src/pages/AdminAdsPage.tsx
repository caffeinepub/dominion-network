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

  const handleDelete = async (id: number) => {
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
      toast.error('Ad toggle is not available');
      return;
    }
    
    try {
      await toggleActive.mutateAsync(id);
    } catch (error: any) {
      console.error('Error toggling ad:', error);
    }
  };

  if (isLoading || capabilities.isLoading) {
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
          message="Failed to load advertisements. Please try again later."
        />
      </div>
    );
  }

  if (!capabilities.hasGetAllAds) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminCapabilityNotice
          type="unavailable"
          message="Advertisement management is not available in the current backend configuration."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advertisement Management</h1>
          <p className="text-muted-foreground">Create and manage advertisements across the platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingAd(null);
                setFormData({
                  title: '',
                  content: '',
                  imageUrl: '',
                  targetUrl: '',
                  placement: 'homepage',
                  adType: 'banner',
                });
              }}
              disabled={!capabilities.hasCreateAd}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}</DialogTitle>
              <DialogDescription>
                {editingAd ? 'Update the advertisement details below.' : 'Fill in the details to create a new advertisement.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    type="url"
                    value={formData.targetUrl}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="placement">Placement</Label>
                    <Select value={formData.placement} onValueChange={(value) => setFormData({ ...formData, placement: value })}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="adType">Ad Type</Label>
                    <Select value={formData.adType} onValueChange={(value) => setFormData({ ...formData, adType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAd.isPending || updateAd.isPending}>
                  {(createAd.isPending || updateAd.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingAd ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {ads.length === 0 ? (
        <AdminCapabilityNotice
          type="empty"
          message="No advertisements found. Create your first ad to get started."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Advertisements</CardTitle>
            <CardDescription>Manage your active and inactive advertisements</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad: any) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell className="capitalize">{ad.placement.__kind__}</TableCell>
                    <TableCell className="capitalize">{ad.adType.__kind__}</TableCell>
                    <TableCell>
                      <Badge variant={ad.active ? 'default' : 'secondary'}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{Number(ad.views)}</TableCell>
                    <TableCell>{Number(ad.clicks)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(Number(ad.id))}
                          disabled={!capabilities.hasToggleAdActive || toggleActive.isPending}
                        >
                          {ad.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ad)}
                          disabled={!capabilities.hasUpdateAd}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(Number(ad.id))}
                          disabled={!capabilities.hasDeleteAd || deleteAd.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
