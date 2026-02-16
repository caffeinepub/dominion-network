import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';
import type { 
  UserProfile, 
  ApprovalStatus, 
  UserApprovalInfo, 
  WalletInfoPublic, 
  WalletInfo, 
  TransactionInfo,
  MediaContent,
  Advertisement,
  DisplayScreenContent,
  AffiliateTier,
  Category,
  TermsAndConditions,
  PendingContent,
  PendingMemberRegistration,
  PendingAdminRequest,
  PendingCardLoad,
  PendingPriceUpdate,
  PendingAffiliatePayout,
  PendingBroadcastRequest,
  PendingHeroJoinRequest,
  ImageLibraryItem,
  AdPlacement
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Admin Status Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await actor.isCallerAdmin();
        return result === true;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: 1,
    staleTime: 30000,
    gcTime: 60000,
  });
}

// Admin Invite Redemption
export function useRedeemAdminInvite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      if (typeof (actor as any).redeemAdminInvite !== 'function') {
        throw new Error('Invite redemption not available');
      }
      return (actor as any).redeemAdminInvite(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      toast.success('Admin privileges granted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to redeem invite: ${error.message}`);
      throw error;
    },
  });
}

// User Approval Queries
export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerApproved();
      } catch (error) {
        console.error('Error checking approval status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
      toast.success('Approval request submitted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to request approval: ${error.message}`);
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listApprovals();
      } catch (error) {
        console.error('Error listing approvals:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: string; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      return actor.setApproval(Principal.fromText(user), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast.success('Approval status updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update approval: ${error.message}`);
    },
  });
}

// Pending Content Submissions
export function useGetPendingContentSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingContent[]>({
    queryKey: ['pendingContent'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingContent();
      } catch (error) {
        console.error('Error fetching pending content:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePendingContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePendingContent(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingContent'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content approval updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve content: ${error.message}`);
    },
  });
}

export const useApproveContentSubmission = useApprovePendingContent;
export const useRejectContentSubmission = useApprovePendingContent;

// Pending Member Registrations
export function useGetPendingMemberRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingMemberRegistration[]>({
    queryKey: ['pendingMemberRegistrations'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingMemberRegistrations();
      } catch (error) {
        console.error('Error fetching pending member registrations:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveMemberRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveMemberRegistration(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingMemberRegistrations'] });
      toast.success('Member registration updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve member: ${error.message}`);
    },
  });
}

// Pending Admin Requests
export function useGetPendingAdminRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingAdminRequest[]>({
    queryKey: ['pendingAdminRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingAdminRequests();
      } catch (error) {
        console.error('Error fetching pending admin requests:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveAdminRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveAdminRequest(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAdminRequests'] });
      toast.success('Admin request updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve admin request: ${error.message}`);
    },
  });
}

// Pending Card Loads
export function useGetPendingCardLoads() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingCardLoad[]>({
    queryKey: ['pendingCardLoads'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingCardLoads();
      } catch (error) {
        console.error('Error fetching pending card loads:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveCardLoad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveCardLoad(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCardLoads'] });
      toast.success('Card load updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve card load: ${error.message}`);
    },
  });
}

// Pending Price Updates
export function useGetPendingPriceUpdates() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingPriceUpdate[]>({
    queryKey: ['pendingPriceUpdates'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingPriceUpdates();
      } catch (error) {
        console.error('Error fetching pending price updates:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePriceUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePriceUpdate(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingPriceUpdates'] });
      toast.success('Price update approved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve price update: ${error.message}`);
    },
  });
}

// Pending Affiliate Payouts
export function useGetPendingAffiliatePayouts() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingAffiliatePayout[]>({
    queryKey: ['pendingAffiliatePayouts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingAffiliatePayouts();
      } catch (error) {
        console.error('Error fetching pending affiliate payouts:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveAffiliatePayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveAffiliatePayout(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingAffiliatePayouts'] });
      toast.success('Affiliate payout updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve payout: ${error.message}`);
    },
  });
}

// Pending Broadcast Requests
export function useGetPendingBroadcastRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingBroadcastRequest[]>({
    queryKey: ['pendingBroadcastRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingBroadcastRequests();
      } catch (error) {
        console.error('Error fetching pending broadcast requests:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveBroadcastRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveBroadcastRequest(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBroadcastRequests'] });
      toast.success('Broadcast request updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve broadcast: ${error.message}`);
    },
  });
}

export const useRejectBroadcastRequest = useApproveBroadcastRequest;

// Pending Hero Join Requests
export function useGetPendingHeroJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingHeroJoinRequest[]>({
    queryKey: ['pendingHeroJoinRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listPendingHeroJoinRequests();
      } catch (error) {
        console.error('Error fetching pending hero join requests:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveHeroJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveHeroJoinRequest(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingHeroJoinRequests'] });
      toast.success('Hero join request updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve hero join: ${error.message}`);
    },
  });
}

export const useRejectHeroJoinRequest = useApproveHeroJoinRequest;

// Image Library
export function useListPendingImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ImageLibraryItem[]>({
    queryKey: ['imageLibrary'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listImageLibraryItems();
      } catch (error) {
        console.error('Error fetching image library:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveImageLibraryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: bigint; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveImageLibraryItem(id, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
      toast.success('Image approval updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve image: ${error.message}`);
    },
  });
}

export const useListApprovedImages = useListPendingImages;
export const useUploadImage = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageData: any) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Image upload not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
      toast.success('Image uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    },
  });
};

export const useApproveImage = useApproveImageLibraryItem;
export const useRejectImage = useApproveImageLibraryItem;
export const useEraseAllImages = () => {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Erase all images not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
      toast.success('All images erased');
    },
    onError: (error: Error) => {
      toast.error(`Failed to erase images: ${error.message}`);
    },
  });
};

// Content Management
export function useGetAllContent() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaContent[]>({
    queryKey: ['content'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listContent();
      } catch (error) {
        console.error('Error fetching content:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export const useGetPopularContent = useGetAllContent;

export function useGetContentByCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaContent[]>({
    queryKey: ['contentByCategory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listContent();
      } catch (error) {
        console.error('Error fetching content by category:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentData: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadContent(contentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload content: ${error.message}`);
    },
  });
}

export function useUpdateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contentData }: { id: bigint; contentData: MediaContent }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContent(id, contentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update content: ${error.message}`);
    },
  });
}

export function useDeleteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete content: ${error.message}`);
    },
  });
}

// Display Content Management
export function useGetActiveDisplayContent() {
  const { actor, isFetching } = useActor();

  return useQuery<DisplayScreenContent | null>({
    queryKey: ['activeDisplayContent'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const content = await actor.getActiveDisplayContent();
        return content.length > 0 ? content[0] : null;
      } catch (error) {
        console.error('Error fetching active display content:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDisplayScreenContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayContent: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDisplayContent(displayContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDisplayContent'] });
      toast.success('Display content uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload display content: ${error.message}`);
    },
  });
}

export function useUpdateDisplayContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, displayContent }: { id: bigint; displayContent: DisplayScreenContent }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDisplayContent(id, displayContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDisplayContent'] });
      toast.success('Display content updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update display content: ${error.message}`);
    },
  });
}

export function useDeleteDisplayContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDisplayContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDisplayContent'] });
      toast.success('Display content deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete display content: ${error.message}`);
    },
  });
}

// Advertisement Management
export function useGetAllAds() {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['advertisements'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActiveAdvertisements();
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdsByPlacement() {
  return useGetAllAds();
}

export function useTrackAdView() {
  return useMutation({
    mutationFn: async (adId: bigint) => {
      // Track ad view - not implemented in backend
      return Promise.resolve();
    },
  });
}

export function useTrackAdClick() {
  return useMutation({
    mutationFn: async (adId: bigint) => {
      // Track ad click - not implemented in backend
      return Promise.resolve();
    },
  });
}

export function useCreateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ad: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAdvertisement(ad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success('Advertisement created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create advertisement: ${error.message}`);
    },
  });
}

export function useUpdateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ad: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdvertisement(ad.id, ad);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success('Advertisement updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update advertisement: ${error.message}`);
    },
  });
}

export function useDeleteAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAdvertisement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success('Advertisement deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete advertisement: ${error.message}`);
    },
  });
}

export function useToggleAdActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Toggle active not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      toast.success('Advertisement status updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to toggle advertisement: ${error.message}`);
    },
  });
}

// Wallet Management
export function useGetWalletInfo() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WalletInfoPublic | null>({
    queryKey: ['walletInfo', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerWallet();
      } catch (error) {
        console.error('Error fetching wallet info:', error);
        return null;
      }
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetWalletInfoWithSeed() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WalletInfo | null>({
    queryKey: ['walletInfoWithSeed', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerWalletWithSeed();
      } catch (error) {
        console.error('Error fetching wallet info with seed:', error);
        return null;
      }
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useCreateWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, seed }: { address: string; seed: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWallet(address, seed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletInfo'] });
      queryClient.invalidateQueries({ queryKey: ['walletInfoWithSeed'] });
      toast.success('Wallet created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create wallet: ${error.message}`);
    },
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (txInfo: TransactionInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(txInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletInfo'] });
      queryClient.invalidateQueries({ queryKey: ['walletInfoWithSeed'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add transaction: ${error.message}`);
    },
  });
}

// Affiliate Management
export function useGetAllAffiliateTiers() {
  const { actor, isFetching } = useActor();

  return useQuery<AffiliateTier[]>({
    queryKey: ['affiliateTiers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listAffiliateTiers();
      } catch (error) {
        console.error('Error fetching affiliate tiers:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAffiliateTier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAffiliateTier(tier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliateTiers'] });
      toast.success('Affiliate tier created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create affiliate tier: ${error.message}`);
    },
  });
}

export function useGenerateReferralLink() {
  return useMutation({
    mutationFn: async () => {
      throw new Error('Generate referral link not implemented in backend');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate referral link: ${error.message}`);
    },
  });
}

export function useGetUserReferralLink() {
  const { actor, isFetching } = useActor();

  return useQuery<any>({
    queryKey: ['userReferralLink'],
    queryFn: async () => {
      if (!actor) return null;
      // Not implemented in backend - return mock data structure
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

// Terms and Conditions
export function useGetActiveTerms() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsAndConditions | null>({
    queryKey: ['activeTerms'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getActiveTerms();
      } catch (error) {
        console.error('Error fetching active terms:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTerms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, version }: { title: string; content: string; version: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTerms(title, content, version);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTerms'] });
      toast.success('Terms created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create terms: ${error.message}`);
    },
  });
}

// Categories
export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
}

// Chat
export function useGetChatRoomMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      // Not fully implemented
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: any) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Send chat message not fully implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      toast.success('Message sent');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}
