import { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useGetPendingContentSubmissions,
  useApproveContentSubmission,
  useRejectContentSubmission,
  useDeleteContent,
  useDeleteCategory,
  useDeleteAdvertisement,
  useDeleteAffiliateTier,
  useDeleteDisplayContent,
} from '../hooks/useQueries';
import { toast } from 'sonner';

export function AdminEditingRoomPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: pendingContent = [], isLoading } = useGetPendingContentSubmissions();
  const approveContent = useApproveContentSubmission();
  const rejectContent = useRejectContentSubmission();
  const deleteContent = useDeleteContent();
  const deleteCategory = useDeleteCategory();
  const deleteAd = useDeleteAdvertisement();
  const deleteTier = useDeleteAffiliateTier();
  const deleteDisplay = useDeleteDisplayContent();

  const handleApprove = async (id: bigint) => {
    try {
      await approveContent.mutateAsync(id);
      toast.success('Content approved successfully');
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };

  const handleReject = async (id: bigint) => {
    try {
      await rejectContent.mutateAsync(id);
      toast.success('Content rejected');
    } catch (error) {
      toast.error('Failed to reject content');
    }
  };

  const handleDelete = async (id: bigint, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return;
    }

    try {
      switch (type) {
        case 'content':
          await deleteContent.mutateAsync(id);
          break;
        case 'category':
          await deleteCategory.mutateAsync(id);
          break;
        case 'advertisement':
          await deleteAd.mutateAsync(id);
          break;
        case 'tier':
          await deleteTier.mutateAsync(id);
          break;
        case 'display':
          await deleteDisplay.mutateAsync(id);
          break;
      }
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const filteredContent = pendingContent.filter(item =>
    item.content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Admin Approval & Editing Room</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Comprehensive content management with approve/decline and delete capabilities
              </p>
            </div>
          </div>
          <Alert className="bg-primary/10 border-primary/30">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Full Content Control:</strong> Approve or decline new submissions, edit existing entries, and delete content across all categories with secure admin access.
            </AlertDescription>
          </Alert>
        </div>

        {/* Search */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Management Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Pending Approval
              {pendingContent.filter(c => c.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingContent.filter(c => c.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs sm:text-sm">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              <Edit className="h-4 w-4 mr-2" />
              All Content
            </TabsTrigger>
          </TabsList>

          {/* Pending Content */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Pending Content Submissions
                </CardTitle>
                <CardDescription>Review and approve or decline new content</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredContent.filter(c => c.status === 'pending').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending content submissions</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredContent
                        .filter(c => c.status === 'pending')
                        .sort((a, b) => Number(b.submittedAt - a.submittedAt))
                        .map((item) => (
                          <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{item.content.title}</h3>
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                                      Pending
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>Type: {item.content.mediaType}</span>
                                    <span>•</span>
                                    <span>Duration: {Number(item.content.duration)}s</span>
                                    <span>•</span>
                                    <span>Views: {Number(item.content.views)}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(item.id)}
                                    disabled={approveContent.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approveContent.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(item.id)}
                                    disabled={rejectContent.isPending}
                                  >
                                    {rejectContent.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Decline
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

          {/* Approved Content */}
          <TabsContent value="approved" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Approved Content
                </CardTitle>
                <CardDescription>Manage approved content entries</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredContent.filter(c => c.status === 'approved').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No approved content</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredContent
                        .filter(c => c.status === 'approved')
                        .sort((a, b) => Number(b.submittedAt - a.submittedAt))
                        .map((item) => (
                          <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{item.content.title}</h3>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                                      Approved
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>Type: {item.content.mediaType}</span>
                                    <span>•</span>
                                    <span>Duration: {Number(item.content.duration)}s</span>
                                    <span>•</span>
                                    <span>Views: {Number(item.content.views)}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toast.info('Edit functionality coming soon')}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.content.id, 'content')}
                                    disabled={deleteContent.isPending}
                                  >
                                    {deleteContent.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4 mr-1" />
                                    )}
                                    Delete
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

          {/* Rejected Content */}
          <TabsContent value="rejected" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Rejected Content
                </CardTitle>
                <CardDescription>Review rejected content submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredContent.filter(c => c.status === 'rejected').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No rejected content</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredContent
                        .filter(c => c.status === 'rejected')
                        .sort((a, b) => Number(b.submittedAt - a.submittedAt))
                        .map((item) => (
                          <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{item.content.title}</h3>
                                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                                      Rejected
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content.description}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(item.content.id, 'content')}
                                  disabled={deleteContent.isPending}
                                >
                                  {deleteContent.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 mr-1" />
                                  )}
                                  Delete
                                </Button>
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

          {/* All Content */}
          <TabsContent value="all" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  All Content
                </CardTitle>
                <CardDescription>Complete content library with edit and delete options</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredContent.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No content found</p>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {filteredContent
                        .sort((a, b) => Number(b.submittedAt - a.submittedAt))
                        .map((item) => (
                          <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg">{item.content.title}</h3>
                                    <Badge
                                      variant="outline"
                                      className={
                                        item.status === 'approved'
                                          ? 'bg-green-500/10 text-green-500 border-green-500/30'
                                          : item.status === 'rejected'
                                          ? 'bg-red-500/10 text-red-500 border-red-500/30'
                                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                                      }
                                    >
                                      {item.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{item.content.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>Type: {item.content.mediaType}</span>
                                    <span>•</span>
                                    <span>Duration: {Number(item.content.duration)}s</span>
                                    <span>•</span>
                                    <span>Views: {Number(item.content.views)}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toast.info('Edit functionality coming soon')}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(item.content.id, 'content')}
                                    disabled={deleteContent.isPending}
                                  >
                                    {deleteContent.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4 mr-1" />
                                    )}
                                    Delete
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
