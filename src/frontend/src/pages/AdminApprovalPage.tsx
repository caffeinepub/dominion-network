import { CheckCircle, XCircle, Clock, FileText, Users, Shield, CreditCard, DollarSign, TrendingUp, Loader2, Image, MessageSquare, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminCapabilityNotice } from '@/components/admin/AdminCapabilityNotice';
import {
  useListApprovals,
  useSetApproval,
  useGetPendingContentSubmissions,
  useApprovePendingContent,
  useGetPendingMemberRegistrations,
  useApproveMemberRegistration,
  useGetPendingAdminRequests,
  useApproveAdminRequest,
  useGetPendingCardLoads,
  useApproveCardLoad,
  useGetPendingPriceUpdates,
  useApprovePriceUpdate,
  useGetPendingAffiliatePayouts,
  useApproveAffiliatePayout,
  useListPendingImages,
  useApproveImageLibraryItem,
  useGetPendingBroadcastRequests,
  useApproveBroadcastRequest,
  useGetPendingHeroJoinRequests,
  useApproveHeroJoinRequest,
} from '../hooks/useQueries';
import { ApprovalStatus } from '../backend';

export function AdminApprovalPage() {
  const { data: userApprovals = [], isLoading: userApprovalsLoading } = useListApprovals();
  const setApproval = useSetApproval();

  const { data: contentSubmissions = [], isLoading: contentLoading } = useGetPendingContentSubmissions();
  const approvePendingContent = useApprovePendingContent();

  const { data: memberRegistrations = [], isLoading: memberLoading } = useGetPendingMemberRegistrations();
  const approveMemberRegistration = useApproveMemberRegistration();

  const { data: adminRequests = [], isLoading: adminLoading } = useGetPendingAdminRequests();
  const approveAdminRequest = useApproveAdminRequest();

  const { data: cardLoads = [], isLoading: cardLoadsLoading } = useGetPendingCardLoads();
  const approveCardLoad = useApproveCardLoad();

  const { data: priceUpdates = [], isLoading: priceLoading } = useGetPendingPriceUpdates();
  const approvePriceUpdate = useApprovePriceUpdate();

  const { data: affiliatePayouts = [], isLoading: payoutsLoading } = useGetPendingAffiliatePayouts();
  const approveAffiliatePayout = useApproveAffiliatePayout();

  const { data: pendingImages = [], isLoading: imagesLoading } = useListPendingImages();
  const approveImageLibraryItem = useApproveImageLibraryItem();

  const { data: broadcastRequests = [], isLoading: broadcastLoading } = useGetPendingBroadcastRequests();
  const approveBroadcastRequest = useApproveBroadcastRequest();

  const { data: heroJoinRequests = [], isLoading: heroJoinLoading } = useGetPendingHeroJoinRequests();
  const approveHeroJoinRequest = useApproveHeroJoinRequest();

  const handleUserApprove = async (user: string) => {
    await setApproval.mutateAsync({ user, status: ApprovalStatus.approved });
  };

  const handleUserReject = async (user: string) => {
    await setApproval.mutateAsync({ user, status: ApprovalStatus.rejected });
  };

  const pendingUserApprovals = userApprovals.filter(u => u.status === ApprovalStatus.pending);
  const pendingContentItems = contentSubmissions.filter(c => c.status === ApprovalStatus.pending);
  const pendingMembers = memberRegistrations.filter(m => m.status === ApprovalStatus.pending);
  const pendingAdmins = adminRequests.filter(a => a.status === ApprovalStatus.pending);
  const pendingCards = cardLoads.filter(c => c.status === ApprovalStatus.pending);
  const pendingPrices = priceUpdates.filter(p => p.status === ApprovalStatus.pending);
  const pendingPayouts = affiliatePayouts.filter(p => p.status === ApprovalStatus.pending);
  const pendingImageItems = pendingImages.filter(i => i.status === ApprovalStatus.pending);
  const pendingBroadcasts = broadcastRequests.filter(b => b.status === ApprovalStatus.pending);
  const pendingHeroJoins = heroJoinRequests.filter(h => h.status === ApprovalStatus.pending);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Approval Control Panel</h1>
          <p className="text-slate-300 text-sm sm:text-base">Review and manage all pending approvals across the platform</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-auto bg-slate-800/50 p-1">
              <TabsTrigger value="users" className="flex items-center gap-2 text-xs sm:text-sm">
                <Users className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">User Approvals</span>
                <span className="sm:hidden">Users</span>
                {pendingUserApprovals.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingUserApprovals.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2 text-xs sm:text-sm">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Content</span>
                <span className="sm:hidden">Content</span>
                {pendingContentItems.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingContentItems.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2 text-xs sm:text-sm">
                <UserPlus className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Members</span>
                <span className="sm:hidden">Members</span>
                {pendingMembers.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingMembers.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Admins</span>
                <span className="sm:hidden">Admins</span>
                {pendingAdmins.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingAdmins.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2 text-xs sm:text-sm">
                <CreditCard className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Card Loads</span>
                <span className="sm:hidden">Cards</span>
                {pendingCards.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingCards.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="prices" className="flex items-center gap-2 text-xs sm:text-sm">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Prices</span>
                <span className="sm:hidden">Prices</span>
                {pendingPrices.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingPrices.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex items-center gap-2 text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Payouts</span>
                <span className="sm:hidden">Payouts</span>
                {pendingPayouts.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingPayouts.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2 text-xs sm:text-sm">
                <Image className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Images</span>
                <span className="sm:hidden">Images</span>
                {pendingImageItems.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingImageItems.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="broadcasts" className="flex items-center gap-2 text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Broadcasts</span>
                <span className="sm:hidden">Broadcasts</span>
                {pendingBroadcasts.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs">{pendingBroadcasts.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* User Approvals Tab */}
          <TabsContent value="users" className="space-y-4">
            {userApprovalsLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingUserApprovals.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending user approvals" />
            ) : (
              <div className="grid gap-4">
                {pendingUserApprovals.map((approval) => (
                  <Card key={approval.principal.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg">User Approval Request</CardTitle>
                          <CardDescription className="font-mono text-xs break-all">
                            {approval.principal.toString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleUserApprove(approval.principal.toString())}
                          disabled={setApproval.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {setApproval.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleUserReject(approval.principal.toString())}
                          disabled={setApproval.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Content Submissions Tab */}
          <TabsContent value="content" className="space-y-4">
            {contentLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingContentItems.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending content submissions" />
            ) : (
              <div className="grid gap-4">
                {pendingContentItems.map((item) => (
                  <Card key={item.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg break-words">{item.content.title}</CardTitle>
                          <CardDescription className="break-words">{item.content.description}</CardDescription>
                          <p className="text-xs text-muted-foreground">Type: {item.content.mediaType}</p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approvePendingContent.mutate({ id: item.id, approved: true })}
                          disabled={approvePendingContent.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approvePendingContent.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approvePendingContent.mutate({ id: item.id, approved: false })}
                          disabled={approvePendingContent.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Member Registrations Tab */}
          <TabsContent value="members" className="space-y-4">
            {memberLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingMembers.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending member registrations" />
            ) : (
              <div className="grid gap-4">
                {pendingMembers.map((member) => (
                  <Card key={member.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg break-words">{member.name}</CardTitle>
                          <CardDescription className="break-words">{member.email}</CardDescription>
                          <p className="text-xs text-muted-foreground font-mono break-all">{member.principal.toString()}</p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveMemberRegistration.mutate({ id: member.id, approved: true })}
                          disabled={approveMemberRegistration.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveMemberRegistration.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveMemberRegistration.mutate({ id: member.id, approved: false })}
                          disabled={approveMemberRegistration.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Admin Requests Tab */}
          <TabsContent value="admins" className="space-y-4">
            {adminLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingAdmins.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending admin requests" />
            ) : (
              <div className="grid gap-4">
                {pendingAdmins.map((admin) => (
                  <Card key={admin.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg break-words">{admin.name}</CardTitle>
                          <CardDescription className="break-words">{admin.email}</CardDescription>
                          <p className="text-xs text-muted-foreground font-mono break-all">{admin.principal.toString()}</p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveAdminRequest.mutate({ id: admin.id, approved: true })}
                          disabled={approveAdminRequest.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveAdminRequest.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveAdminRequest.mutate({ id: admin.id, approved: false })}
                          disabled={approveAdminRequest.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Card Loads Tab */}
          <TabsContent value="cards" className="space-y-4">
            {cardLoadsLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingCards.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending card load requests" />
            ) : (
              <div className="grid gap-4">
                {pendingCards.map((card) => (
                  <Card key={card.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg">Card Load Request</CardTitle>
                          <CardDescription>Amount: ${Number(card.amount).toLocaleString()}</CardDescription>
                          <p className="text-xs text-muted-foreground">Method: {card.method}</p>
                          <p className="text-xs text-muted-foreground font-mono break-all">{card.userId.toString()}</p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveCardLoad.mutate({ id: card.id, approved: true })}
                          disabled={approveCardLoad.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveCardLoad.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveCardLoad.mutate({ id: card.id, approved: false })}
                          disabled={approveCardLoad.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Price Updates Tab */}
          <TabsContent value="prices" className="space-y-4">
            {priceLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingPrices.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending price updates" />
            ) : (
              <div className="grid gap-4">
                {pendingPrices.map((price) => (
                  <Card key={price.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg">Price Update Request</CardTitle>
                          <CardDescription>Item Type: {price.itemType}</CardDescription>
                          <p className="text-sm text-muted-foreground">
                            Old Price: ${Number(price.oldPrice).toLocaleString()} → New Price: ${Number(price.newPrice).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approvePriceUpdate.mutate({ id: price.id, approved: true })}
                          disabled={approvePriceUpdate.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approvePriceUpdate.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approvePriceUpdate.mutate({ id: price.id, approved: false })}
                          disabled={approvePriceUpdate.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Affiliate Payouts Tab */}
          <TabsContent value="payouts" className="space-y-4">
            {payoutsLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingPayouts.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending affiliate payouts" />
            ) : (
              <div className="grid gap-4">
                {pendingPayouts.map((payout) => (
                  <Card key={payout.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg">Affiliate Payout Request</CardTitle>
                          <CardDescription>Amount: ${Number(payout.amount).toLocaleString()}</CardDescription>
                          <p className="text-xs text-muted-foreground break-words">{payout.commissionDetails}</p>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveAffiliatePayout.mutate({ id: payout.id, approved: true })}
                          disabled={approveAffiliatePayout.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveAffiliatePayout.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveAffiliatePayout.mutate({ id: payout.id, approved: false })}
                          disabled={approveAffiliatePayout.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-4">
            {imagesLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingImageItems.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending images" />
            ) : (
              <div className="grid gap-4">
                {pendingImageItems.map((image) => (
                  <Card key={image.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg break-words">{image.title}</CardTitle>
                          <CardDescription className="break-words">{image.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveImageLibraryItem.mutate({ id: image.id, approved: true })}
                          disabled={approveImageLibraryItem.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveImageLibraryItem.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveImageLibraryItem.mutate({ id: image.id, approved: false })}
                          disabled={approveImageLibraryItem.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Broadcasts Tab */}
          <TabsContent value="broadcasts" className="space-y-4">
            {broadcastLoading ? (
              <Card className="border-slate-700 bg-slate-800/50">
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </CardContent>
              </Card>
            ) : pendingBroadcasts.length === 0 ? (
              <AdminCapabilityNotice type="empty" message="No pending broadcast requests" />
            ) : (
              <div className="grid gap-4">
                {pendingBroadcasts.map((broadcast) => (
                  <Card key={broadcast.id.toString()} className="border-slate-700 bg-slate-800/50">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="text-white text-base sm:text-lg break-words">{broadcast.title}</CardTitle>
                          <CardDescription className="break-words">{broadcast.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0 self-start">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => approveBroadcastRequest.mutate({ id: broadcast.id, approved: true })}
                          disabled={approveBroadcastRequest.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {approveBroadcastRequest.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => approveBroadcastRequest.mutate({ id: broadcast.id, approved: false })}
                          disabled={approveBroadcastRequest.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
