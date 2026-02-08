import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllAdvertisements, useCreateAdvertisement, useToggleAdvertisementActive, useDeleteAdvertisement } from '../hooks/useQueries';
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import type { AdPlacement, AdType } from '../types/backend-extended';

export function AdminAdsPage() {
  const { data: ads = [], isLoading } = useGetAllAdvertisements();
  const createAd = useCreateAdvertisement();
  const toggleActive = useToggleAdvertisementActive();
  const deleteAd = useDeleteAdvertisement();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    targetUrl: '',
    placement: 'homepage' as AdPlacement,
    adType: 'banner' as AdType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAd.mutateAsync(formData);
      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: '',
        placement: 'homepage',
        adType: 'banner',
      });
    } catch (error) {
      console.error('Failed to create ad:', error);
    }
  };

  const handleToggleActive = async (id: bigint) => {
    try {
      await toggleActive.mutateAsync(id);
    } catch (error) {
      console.error('Failed to toggle ad:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await deleteAd.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete ad:', error);
      }
    }
  };

  const calculateCTR = (views: bigint, clicks: bigint) => {
    const v = Number(views);
    const c = Number(clicks);
    return v > 0 ? ((c / v) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Advertisement Management</h1>
        <p className="text-muted-foreground">Create and manage advertisements across the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Advertisement
          </CardTitle>
          <CardDescription>Add a new advertisement to the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL</Label>
              <Input
                id="targetUrl"
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placement">Placement</Label>
                <Select
                  value={formData.placement}
                  onValueChange={(value) => setFormData({ ...formData, placement: value as AdPlacement })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="category">Category Pages</SelectItem>
                    <SelectItem value="mall">Mall Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adType">Ad Type</Label>
                <Select
                  value={formData.adType}
                  onValueChange={(value) => setFormData({ ...formData, adType: value as AdType })}
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
            </div>

            <Button type="submit" disabled={createAd.isPending}>
              {createAd.isPending ? 'Creating...' : 'Create Advertisement'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisements</CardTitle>
          <CardDescription>Manage existing advertisements and view performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : ads.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No advertisements yet</p>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground">{ad.content}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Views: {Number(ad.views).toLocaleString()}</span>
                      <span>Clicks: {Number(ad.clicks).toLocaleString()}</span>
                      <span>CTR: {calculateCTR(ad.views, ad.clicks)}%</span>
                      <span>Placement: {ad.placement}</span>
                      <span>Type: {ad.adType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(ad.id)}
                      disabled={toggleActive.isPending}
                    >
                      {ad.active ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Inactive
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ad.id)}
                      disabled={deleteAd.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
