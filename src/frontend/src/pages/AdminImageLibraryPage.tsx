import { useState } from 'react';
import { Image, Trash2, CheckCircle, XCircle, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useListPendingImages,
  useListApprovedImages,
  useUploadImage,
  useApproveImage,
  useRejectImage,
  useEraseAllImages,
} from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminImageLibraryPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: pendingImages = [], isLoading: loadingPending } = useListPendingImages();
  const { data: approvedImages = [], isLoading: loadingApproved } = useListApprovedImages();
  const uploadImage = useUploadImage();
  const approveImage = useApproveImage();
  const rejectImage = useRejectImage();
  const eraseAllImages = useEraseAllImages();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = {
      title,
      description,
      file: imageFile,
    };

    uploadImage.mutate(formData, {
      onSuccess: () => {
        setTitle('');
        setDescription('');
        setImageFile(null);
        const fileInput = document.getElementById('image-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
    });
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1000000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Image Library</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Upload, manage, and approve images for the platform
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" className="gap-2 shrink-0">
                  <Trash2 className="h-5 w-5" />
                  Erase All Images
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all images from the library.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => eraseAllImages.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Image
            </CardTitle>
            <CardDescription>Add a new image to the library for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter image description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-file">Image File</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <Button type="submit" disabled={uploadImage.isPending || !imageFile}>
                {uploadImage.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Image Lists */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pending" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending
              {pendingImages.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingImages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
              {approvedImages.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {approvedImages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pending Images */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Pending Images
                </CardTitle>
                <CardDescription>Review and approve uploaded images</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPending ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingImages.length === 0 ? (
                  <Alert>
                    <AlertDescription>No pending images to review</AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingImages.map((item: any) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg break-words">{item.title}</h3>
                                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                                    Pending
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground break-words">{item.description}</p>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  Uploaded: {formatDate(item.uploadTime)}
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  onClick={() => approveImage.mutate(item.id)}
                                  disabled={approveImage.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {approveImage.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectImage.mutate(item.id)}
                                  disabled={rejectImage.isPending}
                                >
                                  {rejectImage.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Images */}
          <TabsContent value="approved" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Approved Images
                </CardTitle>
                <CardDescription>All approved images in the library</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApproved ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : approvedImages.length === 0 ? (
                  <Alert>
                    <AlertDescription>No approved images yet</AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {approvedImages.map((item: any) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg break-words">{item.title}</h3>
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                                    Approved
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground break-words">{item.description}</p>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  Uploaded: {formatDate(item.uploadTime)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
