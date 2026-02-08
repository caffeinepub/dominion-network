import { useState } from 'react';
import { Image, Upload, CheckCircle, XCircle, Download, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  useListPendingImages,
  useListApprovedImages,
  useUploadImage,
  useApproveImage,
  useRejectImage,
  useGetImageBlob,
  useEraseAllImages,
} from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function AdminImageLibraryPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: pendingImages = [], isLoading: loadingPending } = useListPendingImages();
  const { data: approvedImages = [], isLoading: loadingApproved } = useListApprovedImages();
  const uploadImage = useUploadImage();
  const approveImage = useApproveImage();
  const rejectImage = useRejectImage();
  const getImageBlob = useGetImageBlob();
  const eraseAll = useEraseAllImages();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('Please provide a title and select an image');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadImage.mutateAsync({
        title,
        description,
        image: blob,
        uploadTime: BigInt(Date.now() * 1000000),
      });

      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleDownload = async (id: bigint, title: string) => {
    try {
      const blob = await getImageBlob.mutateAsync(id);
      const bytes = await blob.getBytes();
      const file = new Blob([bytes], { type: 'image/jpeg' });
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center gap-3">
                <Image className="h-8 w-8" />
                Image Library
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Upload, approve, and manage all platform images
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
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Confirm Erase All Images
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all images in the library (pending, approved, and rejected). This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => eraseAll.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {eraseAll.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Erasing...
                      </>
                    ) : (
                      'Erase All'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Image
            </CardTitle>
            <CardDescription>All uploads default to pending status and require approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Image File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description (optional)"
                rows={3}
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={uploadImage.isPending || !selectedFile || !title.trim()}
              className="w-full sm:w-auto"
            >
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
          </CardContent>
        </Card>

        {/* Image Lists */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="pending" className="text-sm">
              Pending
              {pendingImages.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingImages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-sm">
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
                  <p className="text-center text-muted-foreground py-8">No pending images</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {pendingImages.map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                                    Pending
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  Uploaded: {formatDate(item.uploadTime)}
                                </div>
                              </div>
                              <div className="flex gap-2">
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
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Approved Images
                </CardTitle>
                <CardDescription>Manage approved images</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingApproved ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : approvedImages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No approved images</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {approvedImages.map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{item.title}</h3>
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                                    Approved
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  Uploaded: {formatDate(item.uploadTime)}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownload(item.id, item.title)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
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
        </Tabs>
      </div>
    </div>
  );
}
