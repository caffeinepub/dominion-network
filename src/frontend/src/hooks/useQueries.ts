import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';
import type { UserProfile, ApprovalStatus, UserApprovalInfo } from '../backend';

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

// Admin Status Query - Identity-aware with safe fallbacks
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
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
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

// Invite Code Queries
export function useGenerateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateInviteCode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes'] });
      toast.success('Invite code generated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate invite code: ${error.message}`);
    },
  });
}

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getInviteCodes();
      } catch (error) {
        console.error('Error fetching invite codes:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRSVP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, attending, inviteCode }: { name: string; attending: boolean; inviteCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRSVP(name, attending, inviteCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps'] });
      toast.success('RSVP submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit RSVP: ${error.message}`);
    },
  });
}

export function useGetAllRSVPs() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['rsvps'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllRSVPs();
      } catch (error) {
        console.error('Error fetching RSVPs:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Placeholder hooks for approval page - these return safe empty states
export function useGetPendingContentSubmissions() {
  return useQuery({
    queryKey: ['pendingContentSubmissions'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingMemberRegistrations() {
  return useQuery({
    queryKey: ['pendingMemberRegistrations'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingAdminRequests() {
  return useQuery({
    queryKey: ['pendingAdminRequests'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingCardLoads() {
  return useQuery({
    queryKey: ['pendingCardLoads'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingPriceUpdates() {
  return useQuery({
    queryKey: ['pendingPriceUpdates'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingAffiliatePayouts() {
  return useQuery({
    queryKey: ['pendingAffiliatePayouts'],
    queryFn: async () => [] as any[],
  });
}

export function useListPendingImages() {
  return useQuery({
    queryKey: ['pendingImages'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingBroadcastRequests() {
  return useQuery({
    queryKey: ['pendingBroadcastRequests'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPendingHeroJoinRequests() {
  return useQuery({
    queryKey: ['pendingHeroJoinRequests'],
    queryFn: async () => [] as any[],
  });
}

// Placeholder mutation hooks
export function useApproveContentSubmission() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Content approval not yet implemented');
    },
  });
}

export function useRejectContentSubmission() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Content rejection not yet implemented');
    },
  });
}

export function useApproveMemberRegistration() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Member approval not yet implemented');
    },
  });
}

export function useRejectMemberRegistration() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Member rejection not yet implemented');
    },
  });
}

export function useApproveAdminRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Admin approval not yet implemented');
    },
  });
}

export function useRejectAdminRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Admin rejection not yet implemented');
    },
  });
}

export function useApproveCardLoad() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Card load approval not yet implemented');
    },
  });
}

export function useRejectCardLoad() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Card load rejection not yet implemented');
    },
  });
}

export function useApprovePriceUpdate() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Price update approval not yet implemented');
    },
  });
}

export function useRejectPriceUpdate() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Price update rejection not yet implemented');
    },
  });
}

export function useApproveAffiliatePayout() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Payout approval not yet implemented');
    },
  });
}

export function useRejectAffiliatePayout() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Payout rejection not yet implemented');
    },
  });
}

export function useApproveAllPendingItems() {
  return useMutation({
    mutationFn: async () => {
      toast.info('Bulk approval not yet implemented');
    },
  });
}

export function useApproveImage() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Image approval not yet implemented');
    },
  });
}

export function useRejectImage() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Image rejection not yet implemented');
    },
  });
}

export function useApproveBroadcastRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Broadcast approval not yet implemented');
    },
  });
}

export function useRejectBroadcastRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Broadcast rejection not yet implemented');
    },
  });
}

export function useApproveHeroJoinRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Hero join approval not yet implemented');
    },
  });
}

export function useRejectHeroJoinRequest() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Hero join rejection not yet implemented');
    },
  });
}

// Content Management Hooks
export function useGetAllContent() {
  return useQuery({
    queryKey: ['allContent'],
    queryFn: async () => [] as any[],
  });
}

export function useGetPopularContent() {
  return useQuery({
    queryKey: ['popularContent'],
    queryFn: async () => [] as any[],
  });
}

export function useGetContentByCategory(_categoryId: bigint) {
  return useQuery({
    queryKey: ['contentByCategory', _categoryId.toString()],
    queryFn: async () => [] as any[],
  });
}

export function useAddContent() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Content upload not yet implemented');
    },
  });
}

export function useDeleteContent() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Content deletion not yet implemented');
    },
  });
}

// Display Screen Hooks
export function useGetActiveDisplayContent() {
  return useQuery({
    queryKey: ['activeDisplayContent'],
    queryFn: async () => null as any,
  });
}

export function useCreateDisplayScreenContent() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Display content creation not yet implemented');
    },
  });
}

export function useDeleteDisplayContent() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Display content deletion not yet implemented');
    },
  });
}

// Advertisement Hooks
export function useGetAllAds() {
  return useQuery({
    queryKey: ['allAds'],
    queryFn: async () => [] as any[],
  });
}

export function useGetAdsByPlacement(_placement: string) {
  return useQuery({
    queryKey: ['adsByPlacement', _placement],
    queryFn: async () => [] as any[],
  });
}

export function useCreateAd() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Ad creation not yet implemented');
    },
  });
}

export function useUpdateAd() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Ad update not yet implemented');
    },
  });
}

export function useDeleteAd() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Ad deletion not yet implemented');
    },
  });
}

export function useToggleAdActive() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Ad toggle not yet implemented');
    },
  });
}

export function useTrackAdView() {
  return useMutation({
    mutationFn: async (_id: any) => {
      // Silent tracking
    },
  });
}

export function useTrackAdClick() {
  return useMutation({
    mutationFn: async (_id: any) => {
      // Silent tracking
    },
  });
}

// Affiliate Hooks
export function useGetAllAffiliateTiers() {
  return useQuery({
    queryKey: ['affiliateTiers'],
    queryFn: async () => [] as any[],
  });
}

export function useCreateAffiliateTier() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Affiliate tier creation not yet implemented');
    },
  });
}

export function useGenerateReferralLink() {
  return useMutation({
    mutationFn: async () => {
      toast.info('Referral link generation not yet implemented');
    },
  });
}

export function useGetUserReferralLink() {
  return useQuery({
    queryKey: ['userReferralLink'],
    queryFn: async () => null as any,
  });
}

// Chat Hooks
export function useGetChatRoomMessages(_roomId: bigint) {
  return useQuery({
    queryKey: ['chatRoomMessages', _roomId.toString()],
    queryFn: async () => [] as any[],
  });
}

export function useSendChatMessage() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Chat messaging not yet implemented');
    },
  });
}

// Wallet Hooks
export function useGetWalletInfo() {
  return useQuery({
    queryKey: ['walletInfo'],
    queryFn: async () => null as any,
  });
}

export function useCreateWallet() {
  return useMutation({
    mutationFn: async (_seed?: string) => {
      toast.info('Wallet creation not yet implemented');
    },
  });
}

export function useLoadWallet() {
  return useMutation({
    mutationFn: async (_amount: any) => {
      toast.info('Wallet loading not yet implemented');
    },
  });
}

// Terms Hooks
export function useGetActiveTerms() {
  return useQuery({
    queryKey: ['activeTerms'],
    queryFn: async () => null as any,
  });
}

export function useCreateTerms() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Terms creation not yet implemented');
    },
  });
}

// Image Library Hooks
export function useListApprovedImages() {
  return useQuery({
    queryKey: ['approvedImages'],
    queryFn: async () => [] as any[],
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (_data: any) => {
      toast.info('Image upload not yet implemented');
    },
  });
}

export function useGetImageBlob() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Image download not yet implemented');
      return null;
    },
  });
}

export function useEraseAllImages() {
  return useMutation({
    mutationFn: async () => {
      toast.info('Erase all images not yet implemented');
    },
  });
}

// Category Hooks
export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (_id: any) => {
      toast.info('Category deletion not yet implemented');
    },
  });
}
