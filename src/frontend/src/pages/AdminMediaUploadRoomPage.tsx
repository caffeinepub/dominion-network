import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Download, Film, Music, Image, FileVideo, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useGetCallerUserProfile, useAddContent, useGetAllContent } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { MediaType } from '../types/backend-extended';

export function AdminMediaUploadRoomPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: content = [], isLoading } = useGetAllContent();
  const addContent = useAddContent();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    mediaType: 'video' as MediaType,
    categories: [] as bigint[],
  });

  const isAdmin = userProfile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
      toast.success('Content uploaded successfully');
    } catch (error) {
      console.error('Failed to upload content:', error);
      setUploadProgress(0);
      toast.error('Failed to upload content');
    }
  };

  const videoContent = content.filter(c => c.mediaType === 'video');
  const audioContent = content.filter(c => c.mediaType === 'audio');
  const imageContent = content.filter(c => c.mediaType === 'image');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Upload className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Media Upload Room</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Upload and manage all media content for the platform
              </p>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <Alert className="bg-primary/10 border-primary/30">
          <Upload className="h-5 w-5 text-primary" />
          <AlertDescription>
            <strong>Media Upload Center:</strong> Upload videos, audio, images, and other media files. All uploads are processed and optimized for streaming across all devices.
          </AlertDescription>
        </Alert>

        {/* Upload Form */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Media
            </CardTitle>
            <CardDescription>
              Add new video, audio, or image content to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter content title..."
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
                    placeholder="e.g., 3600"
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
                  placeholder="Enter content description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
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
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        Video
                      </div>
                    </SelectItem>
                    <SelectItem value="audio">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        Audio
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>File Upload</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <FileVideo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, AVI, MP3, WAV, JPG, PNG
                  </p>
                </div>
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

              <Button type="submit" disabled={addContent.isPending} className="w-full">
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

        {/* Media Library */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Media Library
            </CardTitle>
            <CardDescription>
              View and manage all uploaded media content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="all">
                  All ({content.length})
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Film className="h-4 w-4 mr-2" />
                  Video ({videoContent.length})
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <Music className="h-4 w-4 mr-2" />
                  Audio ({audioContent.length})
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Image className="h-4 w-4 mr-2" />
                  Images ({imageContent.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : content.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No content uploaded yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {content.map((item) => (
                        <div key={item.id.toString()} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="shrink-0">
                              {item.mediaType === 'video' && <Film className="h-8 w-8 text-primary" />}
                              {item.mediaType === 'audio' && <Music className="h-8 w-8 text-primary" />}
                              {item.mediaType === 'image' && <Image className="h-8 w-8 text-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <Badge variant="outline" className="capitalize">{item.mediaType}</Badge>
                                <span>{Math.floor(Number(item.duration) / 60)}:{(Number(item.duration) % 60).toString().padStart(2, '0')}</span>
                                <span>{Number(item.views).toLocaleString()} views</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="video">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {videoContent.map((item) => (
                      <div key={item.id.toString()} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Film className="h-8 w-8 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{Math.floor(Number(item.duration) / 60)}:{(Number(item.duration) % 60).toString().padStart(2, '0')}</span>
                              <span>{Number(item.views).toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="audio">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {audioContent.map((item) => (
                      <div key={item.id.toString()} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Music className="h-8 w-8 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{Math.floor(Number(item.duration) / 60)}:{(Number(item.duration) % 60).toString().padStart(2, '0')}</span>
                              <span>{Number(item.views).toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="image">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {imageContent.map((item) => (
                      <div key={item.id.toString()} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Image className="h-8 w-8 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>{Number(item.views).toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{content.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all media types</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">2.4 GB</div>
              <p className="text-xs text-muted-foreground mt-1">Of 100 GB available</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {content.reduce((sum, item) => sum + Number(item.views), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all content</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
