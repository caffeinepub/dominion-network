import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useGetPendingContentSubmissions,
  useApprovePendingContent,
  useGetAllContent,
  useDeleteContent,
  useGetAllAds,
  useDeleteAd,
  useDeleteCategory,
  useGetAllCategories,
  useDeleteDisplayContent,
} from '../hooks/useQueries';
import { CheckCircle, XCircle, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminEditingRoomPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const { data: pendingContent = [], isLoading: pendingLoading } = useGetPendingContentSubmissions();
  const { data: allContent = [], isLoading: contentLoading } = useGetAllContent();
  const { data: allAds = [], isLoading: adsLoading } = useGetAllAds();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategories();

  const approvePending = useApprovePendingContent();
  const deleteContent = useDeleteContent();
  const deleteAd = useDeleteAd();
  const deleteCategory = useDeleteCategory();
  const deleteDisplay = useDeleteDisplayContent();

  const handleApprove = async (id: bigint) => {
    try {
      await approvePending.mutateAsync({ id, approved: true });
    } catch (error) {
      console.error('Failed to approve content:', error);
    }
  };

  const handleReject = async (id: bigint) => {
    try {
      await approvePending.mutateAsync({ id, approved: false });
    } catch (error) {
      console.error('Failed to reject content:', error);
    }
  };

  const handleDeleteContent = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const handleDeleteAd = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAd.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete ad:', error);
      }
    }
  };

  const filteredContent = allContent.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Admin Editing Room</h1>
        <p className="text-muted-foreground">Review, approve, and manage all platform content</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="pending">
            Pending
            {pendingContent.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingContent.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Content</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pendingContent.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending content submissions
              </CardContent>
            </Card>
          ) : (
            pendingContent.map((item) => (
              <Card key={item.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{item.content.title}</CardTitle>
                      <CardDescription>{item.content.description}</CardDescription>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(item.id)}
                      disabled={approvePending.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(item.id)}
                      disabled={approvePending.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Approved content view not yet implemented
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Rejected content view not yet implemented
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {contentLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredContent.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No content found
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Views</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContent.map((item) => (
                    <tr key={item.id.toString()} className="border-b">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2 capitalize">{item.mediaType}</td>
                      <td className="p-2">{Number(item.views)}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteContent(item.id)}
                          disabled={deleteContent.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
