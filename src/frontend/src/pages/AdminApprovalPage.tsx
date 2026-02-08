import { CheckCircle, XCircle, Clock, FileText, Users, Shield, CreditCard, DollarSign, TrendingUp, Loader2, CheckCheck, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useGetPendingContentSubmissions,
  useGetPendingMemberRegistrations,
  useGetPendingAdminRequests,
  useGetPendingCardLoads,
  useGetPendingPriceUpdates,
  useGetPendingAffiliatePayouts,
  useApproveContentSubmission,
  useRejectContentSubmission,
  useApproveMemberRegistration,
  useRejectMemberRegistration,
  useApproveAdminRequest,
  useRejectAdminRequest,
  useApproveCardLoad,
  useRejectCardLoad,
  useApprovePriceUpdate,
  useRejectPriceUpdate,
  useApproveAffiliatePayout,
  useRejectAffiliatePayout,
  useApproveAllPendingItems,
  useListPendingImages,
  useApproveImage,
  useRejectImage,
} from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ApprovalStatusType = 'pending' | 'approved' | 'rejected';

export function AdminApprovalPage() {
  const { data: pendingContent = [], isLoading: loadingContent } = useGetPendingContentSubmissions();
  const { data: pendingMembers = [], isLoading: loadingMembers } = useGetPendingMemberRegistrations();
  const { data: pendingAdmins = [], isLoading: loadingAdmins } = useGetPendingAdminRequests();
  const { data: pendingCardLoads = [], isLoading: loadingCards } = useGetPendingCardLoads();
  const { data: pendingPriceUpdates = [], isLoading: loadingPrices } = useGetPendingPriceUpdates();
  const { data: pendingPayouts = [], isLoading: loadingPayouts } = useGetPendingAffiliatePayouts();
  const { data: pendingImages = [], isLoading: loadingImages } = useListPendingImages();

  const approveContent = useApproveContentSubmission();
  const rejectContent = useRejectContentSubmission();
  const approveMember = useApproveMemberRegistration();
  const rejectMember = useRejectMemberRegistration();
  const approveAdmin = useApproveAdminRequest();
  const rejectAdmin = useRejectAdminRequest();
  const approveCard = useApproveCardLoad();
  const rejectCard = useRejectCardLoad();
  const approvePrice = useApprovePriceUpdate();
  const rejectPrice = useRejectPriceUpdate();
  const approvePayout = useApproveAffiliatePayout();
  const rejectPayout = useRejectAffiliatePayout();
  const approveAll = useApproveAllPendingItems();
  const approveImage = useApproveImage();
  const rejectImage = useRejectImage();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: ApprovalStatusType) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
  };

  const pendingContentCount = pendingContent.filter(c => c.status === 'pending').length;
  const pendingMembersCount = pendingMembers.filter(m => m.status === 'pending').length;
  const pendingAdminsCount = pendingAdmins.filter(a => a.status === 'pending').length;
  const pendingCardsCount = pendingCardLoads.filter(c => c.status === 'pending').length;
  const pendingPricesCount = pendingPriceUpdates.filter(p => p.status === 'pending').length;
  const pendingPayoutsCount = pendingPayouts.filter(p => p.status === 'pending').length;
  const pendingImagesCount = pendingImages.length;

  const totalPendingCount = pendingContentCount + pendingMembersCount + pendingAdminsCount + 
                            pendingCardsCount + pendingPricesCount + pendingPayoutsCount + pendingImagesCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Master Admin Approval Control Panel</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Centralized control for all pending approvals across the platform
              </p>
            </div>
            {totalPendingCount > 0 && (
              <Button
                onClick={() => approveAll.mutate()}
                disabled={approveAll.isPending}
                size="lg"
                className="bg-green-600 hover:bg-green-700 gap-2 shrink-0 shadow-lg"
              >
                {approveAll.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Approving All...
                  </>
                ) : (
                  <>
                    <CheckCheck className="h-5 w-5" />
                    Approve All Pending ({totalPendingCount})
                  </>
                )}
              </Button>
            )}
          </div>
          {totalPendingCount > 0 && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCheck className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                <strong>Master Control:</strong> Click "Approve All Pending" to approve all {totalPendingCount} pending items across all categories at once.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingContentCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingMembersCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingAdminsCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Card Loads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingCardsCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingPricesCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingPayoutsCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingImagesCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-auto min-w-full bg-muted/50 p-1">
              <TabsTrigger value="content" className="text-xs sm:text-sm whitespace-nowrap">
                <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Content</span>
                {pendingContentCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingContentCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="images" className="text-xs sm:text-sm whitespace-nowrap">
                <Image className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Images</span>
                {pendingImagesCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingImagesCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="members" className="text-xs sm:text-sm whitespace-nowrap">
                <Users className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Members</span>
                {pendingMembersCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingMembersCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="admins" className="text-xs sm:text-sm whitespace-nowrap">
                <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Admins</span>
                {pendingAdminsCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingAdminsCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-xs sm:text-sm whitespace-nowrap">
                <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Cards</span>
                {pendingCardsCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingCardsCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="prices" className="text-xs sm:text-sm whitespace-nowrap">
                <DollarSign className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Prices</span>
                {pendingPricesCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingPricesCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="payouts" className="text-xs sm:text-sm whitespace-nowrap">
                <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Payouts</span>
                {pendingPayoutsCount > 0 && <Badge variant="destructive" className="ml-1 sm:ml-2 h-5 w-5 p-0 text-xs">{pendingPayoutsCount}</Badge>}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Content Submissions */}
          <TabsContent value="content" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Content Submissions
                </CardTitle>
                <CardDescription>Review and approve user-submitted content</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingContent ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingContent.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending content submissions</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingContent.sort((a, b) => Number(b.submittedAt - a.submittedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg break-words">{item.content.title}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 break-words">{item.content.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span>Type: {item.content.mediaType}</span>
                                  <span>•</span>
                                  <span>Submitted: {formatDate(item.submittedAt)}</span>
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approveContent.mutate(item.id)}
                                    disabled={approveContent.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approveContent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectContent.mutate(item.id)}
                                    disabled={rejectContent.isPending}
                                  >
                                    {rejectContent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Pending Images
                </CardTitle>
                <CardDescription>Review and approve uploaded images</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingImages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingImages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending images</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingImages.map((item) => (
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
                                  {approveImage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectImage.mutate(item.id)}
                                  disabled={rejectImage.isPending}
                                >
                                  {rejectImage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
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

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pending Member Registrations
                </CardTitle>
                <CardDescription>Review and approve new member registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending member registrations</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingMembers.sort((a, b) => Number(b.requestedAt - a.requestedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg break-words">{item.name}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <p className="text-sm text-muted-foreground break-all">{item.email}</p>
                                <div className="text-xs text-muted-foreground">
                                  Requested: {formatDate(item.requestedAt)}
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approveMember.mutate(item.id)}
                                    disabled={approveMember.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approveMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectMember.mutate(item.id)}
                                    disabled={rejectMember.isPending}
                                  >
                                    {rejectMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Admin Requests
                </CardTitle>
                <CardDescription>Review and approve admin privilege requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAdmins ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingAdmins.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending admin requests</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingAdmins.sort((a, b) => Number(b.requestedAt - a.requestedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg break-words">{item.name}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <p className="text-sm text-muted-foreground break-all">{item.email}</p>
                                <div className="text-xs text-muted-foreground">
                                  Requested: {formatDate(item.requestedAt)}
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approveAdmin.mutate(item.id)}
                                    disabled={approveAdmin.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approveAdmin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectAdmin.mutate(item.id)}
                                    disabled={rejectAdmin.isPending}
                                  >
                                    {rejectAdmin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pending Card Loads
                </CardTitle>
                <CardDescription>Review and approve credit card load requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCards ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingCardLoads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending card loads</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingCardLoads.sort((a, b) => Number(b.requestedAt - a.requestedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">${Number(item.amount).toLocaleString()}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  <span>Method: {item.method}</span>
                                  <span>•</span>
                                  <span>Requested: {formatDate(item.requestedAt)}</span>
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approveCard.mutate(item.id)}
                                    disabled={approveCard.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approveCard.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectCard.mutate(item.id)}
                                    disabled={rejectCard.isPending}
                                  >
                                    {rejectCard.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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

          {/* Prices Tab */}
          <TabsContent value="prices" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pending Price Updates
                </CardTitle>
                <CardDescription>Review and approve price change requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPrices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingPriceUpdates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending price updates</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingPriceUpdates.sort((a, b) => Number(b.requestedAt - a.requestedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">{item.itemType} #{item.itemId.toString()}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  <span>Old: ${Number(item.oldPrice).toLocaleString()}</span>
                                  <span>→</span>
                                  <span className="text-primary font-semibold">New: ${Number(item.newPrice).toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Requested: {formatDate(item.requestedAt)}
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approvePrice.mutate(item.id)}
                                    disabled={approvePrice.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approvePrice.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectPrice.mutate(item.id)}
                                    disabled={rejectPrice.isPending}
                                  >
                                    {rejectPrice.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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

          {/* Payouts Tab */}
          <TabsContent value="payouts" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pending Affiliate Payouts
                </CardTitle>
                <CardDescription>Review and approve affiliate commission payouts</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPayouts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pendingPayouts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending payouts</p>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {pendingPayouts.sort((a, b) => Number(b.requestedAt - a.requestedAt)).map((item) => (
                        <Card key={item.id.toString()} className="bg-muted/30 border-border/50">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">${Number(item.amount).toLocaleString()}</h3>
                                  {getStatusBadge(item.status as ApprovalStatusType)}
                                </div>
                                <p className="text-sm text-muted-foreground break-words">{item.commissionDetails}</p>
                                <div className="text-xs text-muted-foreground">
                                  Requested: {formatDate(item.requestedAt)}
                                </div>
                              </div>
                              {item.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    onClick={() => approvePayout.mutate(item.id)}
                                    disabled={approvePayout.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {approvePayout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectPayout.mutate(item.id)}
                                    disabled={rejectPayout.isPending}
                                  >
                                    {rejectPayout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                                    Reject
                                  </Button>
                                </div>
                              )}
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
