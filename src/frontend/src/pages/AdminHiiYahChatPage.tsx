import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetPendingBroadcastRequests,
  useApproveBroadcastRequest,
  useGetPendingHeroJoinRequests,
  useApproveHeroJoinRequest,
} from '../hooks/useQueries';
import { CheckCircle, XCircle, Radio, UserPlus, Loader2 } from 'lucide-react';

export function AdminHiiYahChatPage() {
  const { data: broadcastRequests = [], isLoading: broadcastLoading } = useGetPendingBroadcastRequests();
  const { data: heroJoinRequests = [], isLoading: heroJoinLoading } = useGetPendingHeroJoinRequests();

  const approveBroadcast = useApproveBroadcastRequest();
  const approveHeroJoin = useApproveHeroJoinRequest();

  const handleApproveBroadcast = async (requestId: bigint) => {
    try {
      await approveBroadcast.mutateAsync({ id: requestId, approved: true });
    } catch (error) {
      console.error('Failed to approve broadcast:', error);
    }
  };

  const handleRejectBroadcast = async (requestId: bigint) => {
    try {
      await approveBroadcast.mutateAsync({ id: requestId, approved: false });
    } catch (error) {
      console.error('Failed to reject broadcast:', error);
    }
  };

  const handleApproveHeroJoin = async (requestId: bigint) => {
    try {
      await approveHeroJoin.mutateAsync({ id: requestId, approved: true });
    } catch (error) {
      console.error('Failed to approve hero join:', error);
    }
  };

  const handleRejectHeroJoin = async (requestId: bigint) => {
    try {
      await approveHeroJoin.mutateAsync({ id: requestId, approved: false });
    } catch (error) {
      console.error('Failed to reject hero join:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">HiiYah Chat Management</h1>
        <p className="text-muted-foreground">Manage broadcast and Hero join requests</p>
      </div>

      <Tabs defaultValue="broadcasts">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="broadcasts">
            <Radio className="h-4 w-4 mr-2" />
            Broadcasts
            {broadcastRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">{broadcastRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="hero-joins">
            <UserPlus className="h-4 w-4 mr-2" />
            Hero Joins
            {heroJoinRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">{heroJoinRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broadcasts" className="space-y-4">
          {broadcastLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : broadcastRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending broadcast requests
              </CardContent>
            </Card>
          ) : (
            broadcastRequests.map((request) => (
              <Card key={request.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{request.title}</CardTitle>
                      <CardDescription>{request.description}</CardDescription>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveBroadcast(request.id)}
                      disabled={approveBroadcast.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectBroadcast(request.id)}
                      disabled={approveBroadcast.isPending}
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

        <TabsContent value="hero-joins" className="space-y-4">
          {heroJoinLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : heroJoinRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No pending Hero join requests
              </CardContent>
            </Card>
          ) : (
            heroJoinRequests.map((request) => (
              <Card key={request.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Hero Join Request</CardTitle>
                      <CardDescription>Room ID: {request.roomId.toString()}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                        {request.requestedBy.toString()}
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveHeroJoin(request.id)}
                      disabled={approveHeroJoin.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectHeroJoin(request.id)}
                      disabled={approveHeroJoin.isPending}
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
      </Tabs>
    </div>
  );
}
