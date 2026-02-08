import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Radio, Users, MessageSquare, Shield, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetPendingBroadcastRequests,
  useGetPendingHeroJoinRequests,
  useApproveBroadcastRequest,
  useRejectBroadcastRequest,
  useApproveHeroJoinRequest,
  useRejectHeroJoinRequest,
} from '../hooks/useQueries';

export function AdminHiiYahChatPage() {
  const { data: pendingBroadcasts = [] } = useGetPendingBroadcastRequests();
  const { data: pendingHeroJoins = [] } = useGetPendingHeroJoinRequests();

  const approveBroadcast = useApproveBroadcastRequest();
  const rejectBroadcast = useRejectBroadcastRequest();
  const approveHeroJoin = useApproveHeroJoinRequest();
  const rejectHeroJoin = useRejectHeroJoinRequest();

  const handleApproveBroadcast = async (requestId: bigint) => {
    try {
      await approveBroadcast.mutateAsync(requestId);
      toast.success('Broadcast approved!');
    } catch (error: any) {
      toast.error(`Failed to approve: ${error.message}`);
    }
  };

  const handleRejectBroadcast = async (requestId: bigint) => {
    try {
      await rejectBroadcast.mutateAsync(requestId);
      toast.success('Broadcast rejected');
    } catch (error: any) {
      toast.error(`Failed to reject: ${error.message}`);
    }
  };

  const handleApproveHeroJoin = async (requestId: bigint) => {
    try {
      await approveHeroJoin.mutateAsync(requestId);
      toast.success('Hero join approved!');
    } catch (error: any) {
      toast.error(`Failed to approve: ${error.message}`);
    }
  };

  const handleRejectHeroJoin = async (requestId: bigint) => {
    try {
      await rejectHeroJoin.mutateAsync(requestId);
      toast.success('Hero join rejected');
    } catch (error: any) {
      toast.error(`Failed to reject: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Shield className="h-8 w-8" />
            HiiYah Chat Administration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage live broadcasts, Hero participation, and chat moderation
          </p>
        </div>
      </div>

      <Tabs defaultValue="broadcasts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="broadcasts">
            <Radio className="h-4 w-4 mr-2" />
            Broadcast Requests
          </TabsTrigger>
          <TabsTrigger value="hero">
            <MessageSquare className="h-4 w-4 mr-2" />
            Hero Join Requests
          </TabsTrigger>
          <TabsTrigger value="active">
            <Users className="h-4 w-4 mr-2" />
            Active Broadcasts
          </TabsTrigger>
        </TabsList>

        {/* Broadcast Requests */}
        <TabsContent value="broadcasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Broadcast Requests</CardTitle>
              <CardDescription>
                Approve or reject user requests to go live ({pendingBroadcasts.length} pending)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBroadcasts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending broadcast requests</p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {pendingBroadcasts.map((request) => (
                      <div key={request.id.toString()} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                            <p className="text-xs text-muted-foreground">
                              User: {request.userId.toString().slice(0, 20)}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {new Date(Number(request.requestedAt) / 1000000).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                            {request.status}
                          </Badge>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveBroadcast(request.id)}
                              disabled={approveBroadcast.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectBroadcast(request.id)}
                              disabled={rejectBroadcast.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Join Requests */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Join Requests</CardTitle>
              <CardDescription>
                Approve or reject Hero Helper join requests ({pendingHeroJoins.length} pending)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingHeroJoins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending Hero join requests</p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {pendingHeroJoins.map((request) => (
                      <div key={request.id.toString()} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">Room ID: {request.roomId.toString()}</h3>
                            <p className="text-xs text-muted-foreground">
                              User: {request.requestedBy.toString().slice(0, 20)}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Requested: {new Date(Number(request.requestedAt) / 1000000).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                            {request.status}
                          </Badge>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveHeroJoin(request.id)}
                              disabled={approveHeroJoin.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectHeroJoin(request.id)}
                              disabled={rejectHeroJoin.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Broadcasts */}
        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Broadcasts</CardTitle>
              <CardDescription>
                Currently live broadcasts on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No active broadcasts</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
