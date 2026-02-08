import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddContent, useGetAllContent, useDeleteContent } from '../hooks/useQueries';
import { Upload, Download, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MediaType } from '../types/backend-extended';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function AdminContentPage() {
  const { data: content = [], isLoading } = useGetAllContent();
  const addContent = useAddContent();
  const deleteContent = useDeleteContent();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    mediaType: 'video' as MediaType,
    categories: [] as bigint[],
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await addContent.mutateAsync({
        title: formData.title,
        description: formData.description,
        duration: BigInt(formData.duration),
        file: null,
        thumbnail: null,
        mediaType: formData.mediaType,
        categories: formData.categories,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setFormData({
        title: '',
        description: '',
        duration: '',
        mediaType: 'video',
        categories: [],
      });
      
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Failed to upload content:', error);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (contentId: bigint) => {
    try {
      await deleteContent.mutateAsync(contentId);
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Content Management</h1>
        <p className="text-muted-foreground">Upload and manage multimedia content</p>
      </div>

      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Content
          </CardTitle>
          <CardDescription>Add new video, audio, or image content to the platform</CardDescription>
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
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
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
              <Label htmlFor="mediaType">Media Type</Label>
              <Select
                value={formData.mediaType}
                onValueChange={(value) => setFormData({ ...formData, mediaType: value as MediaType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Upload Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={addContent.isPending}>
              {addContent.isPending ? (
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

      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Uploaded Content
          </CardTitle>
          <CardDescription>View and manage all uploaded content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : content.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No content uploaded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Duration</th>
                    <th className="text-left p-2">Views</th>
                    <th className="text-left p-2">Rating</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((item) => (
                    <tr key={item.id.toString()} className="border-b">
                      <td className="p-2 break-words max-w-xs">{item.title}</td>
                      <td className="p-2 capitalize">{item.mediaType}</td>
                      <td className="p-2">{Math.floor(Number(item.duration) / 60)}:{(Number(item.duration) % 60).toString().padStart(2, '0')}</td>
                      <td className="p-2">{Number(item.views).toLocaleString()}</td>
                      <td className="p-2">{Number(item.rating) / 10}/10</td>
                      <td className="p-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={deleteContent.isPending}
                            >
                              {deleteContent.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Content</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
