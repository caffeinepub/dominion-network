import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDisplayScreenContent, useGetActiveDisplayContent } from '../hooks/useQueries';
import { Monitor, Upload, Loader2 } from 'lucide-react';
import type { DisplayContentType } from '../types/backend-extended';

export function AdminDisplayPage() {
  const { data: activeContent } = useGetActiveDisplayContent();
  const createContent = useCreateDisplayScreenContent();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'movie' as DisplayContentType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createContent.mutateAsync({
        ...formData,
        file: null,
      });
      
      setFormData({
        title: '',
        description: '',
        contentType: 'movie',
      });
    } catch (error) {
      console.error('Failed to create display content:', error);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Display Screen Management</h1>
        <p className="text-muted-foreground">Manage content for the theater display screen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Currently Playing
          </CardTitle>
          <CardDescription>Content currently displayed on the theater screen</CardDescription>
        </CardHeader>
        <CardContent>
          {activeContent ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{activeContent.title}</h3>
              <p className="text-muted-foreground">{activeContent.description}</p>
              <p className="text-sm text-muted-foreground capitalize">Type: {activeContent.contentType}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No content currently playing</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Display Content
          </CardTitle>
          <CardDescription>Add new content to the display screen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value as DisplayContentType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={createContent.isPending}>
              {createContent.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
