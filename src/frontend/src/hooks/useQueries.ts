import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  MediaContent,
  Category,
  MediaType,
  DisplayScreenContent,
  PendingContent,
  PendingMemberRegistration,
  PendingAdminRequest,
  PendingCardLoad,
  PendingPriceUpdate,
  PendingAffiliatePayout,
  PendingBroadcastRequest,
  PendingHeroJoinRequest,
  Advertisement,
  AdPlacement,
  AdType,
  AffiliateTier,
  ReferralLink,
  WalletInfoPublic,
  TermsAndConditions,
  ChatMessage,
  MessageType,
  TransactionType,
  MagicLinkInvitation,
  ImageLibraryItem,
} from '../types/backend-extended';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

// Helper function to check if a method exists on the actor
const hasMethod = (actor: any, methodName: string): boolean => {
  return actor && typeof actor[methodName] === 'function';
};

// Admin Check Query - Include principal in queryKey to prevent stale cache across identity changes
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  
  const principalString = identity?.getPrincipal().toString() || 'anonymous';

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalString],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'isCallerAdmin')) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
    staleTime: 0, // Always fetch fresh admin status
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes but always refetch
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Image Library Queries
export function useListPendingImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ImageLibraryItem[]>({
    queryKey: ['imageLibrary', 'pending'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'listPendingImages')) return [];
      return (actor as any).listPendingImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListApprovedImages() {
  const { actor, isFetching } = useActor();

  return useQuery<ImageLibraryItem[]>({
    queryKey: ['imageLibrary', 'approved'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'listApprovedImages')) return [];
      return (actor as any).listApprovedImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      image: ExternalBlob;
      uploadTime: bigint;
    }) => {
      if (!actor || !hasMethod(actor, 'uploadImage')) {
        toast.error('Image upload not available');
        throw new Error('Method not available');
      }
      return (actor as any).uploadImage(params.title, params.description, params.image, params.uploadTime);
    },
    onSuccess: () => {
      toast.success('Image uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: () => {
      toast.error('Failed to upload image');
    },
  });
}

export function useApproveImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveImage')) {
        toast.error('Image approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveImage(id);
    },
    onSuccess: () => {
      toast.success('Image approved');
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: () => {
      toast.error('Failed to approve image');
    },
  });
}

export function useRejectImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectImage')) {
        toast.error('Image rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectImage(id);
    },
    onSuccess: () => {
      toast.success('Image rejected');
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: () => {
      toast.error('Failed to reject image');
    },
  });
}

export function useGetImageBlob() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'getImageBlob')) {
        toast.error('Image download not available');
        throw new Error('Method not available');
      }
      return (actor as any).getImageBlob(id);
    },
  });
}

export function useEraseAllImages() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !hasMethod(actor, 'eraseAllImages')) {
        toast.error('Erase all images not available');
        throw new Error('Method not available');
      }
      return (actor as any).eraseAllImages();
    },
    onSuccess: () => {
      toast.success('All images erased');
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: () => {
      toast.error('Failed to erase images');
    },
  });
}

// Magic Link Admin Invitation Queries
export function useCreateMagicLinkInvitation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { email: string; token: string; expiresAt: bigint }) => {
      if (!actor || !hasMethod(actor, 'createMagicLinkInvitation')) {
        toast.error('Magic link creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createMagicLinkInvitation(params.email, params.token, params.expiresAt);
    },
    onSuccess: () => {
      toast.success('Magic link invitation created');
      queryClient.invalidateQueries({ queryKey: ['magicLinks'] });
    },
    onError: () => {
      toast.error('Failed to create magic link invitation');
    },
  });
}

export function useListMagicLinkInvitations() {
  const { actor, isFetching } = useActor();

  return useQuery<MagicLinkInvitation[]>({
    queryKey: ['magicLinks'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'listMagicLinkInvitations')) return [];
      return (actor as any).listMagicLinkInvitations();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Status Management Queries
export function useUpdateUserOnlineStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!actor || !hasMethod(actor, 'updateUserOnlineStatus')) {
        throw new Error('Method not available');
      }
      return (actor as any).updateUserOnlineStatus(isOnline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['onlineUsers'] });
    },
  });
}

export function useListOnlineUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[any, boolean]>>({
    queryKey: ['onlineUsers'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'listOnlineUsers')) return [];
      return (actor as any).listOnlineUsers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Content Queries
export function useGetAllContent() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaContent[]>({
    queryKey: ['content', 'all'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAllContent')) return [];
      return (actor as any).getAllContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPopularContent() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaContent[]>({
    queryKey: ['content', 'popular'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPopularContent')) return [];
      return (actor as any).getPopularContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContentByCategory(categoryId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaContent[]>({
    queryKey: ['content', 'category', categoryId.toString()],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getContentByCategory')) return [];
      return (actor as any).getContentByCategory(categoryId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateViews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: bigint) => {
      if (!actor || !hasMethod(actor, 'updateViews')) return;
      return (actor as any).updateViews(contentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  
  const principalString = identity?.getPrincipal().toString() || 'anonymous';

  const query = useQuery<any>({
    queryKey: ['currentUserProfile', principalString],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getCallerUserProfile')) return null;
      return (actor as any).getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useAddContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      duration: bigint;
      file: any;
      thumbnail: any;
      mediaType: MediaType;
      categories: bigint[];
    }) => {
      if (!actor || !hasMethod(actor, 'addContent')) {
        toast.error('Content upload not available');
        throw new Error('Method not available');
      }
      return (actor as any).addContent(
        params.title,
        params.description,
        params.duration,
        params.file,
        params.thumbnail,
        params.mediaType,
        params.categories
      );
    },
    onSuccess: () => {
      toast.success('Content added successfully');
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error) => {
      console.error('Failed to add content:', error);
      toast.error('Failed to add content');
    },
  });
}

export function useDeleteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteContent')) {
        toast.error('Content deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteContent(contentId);
    },
    onSuccess: () => {
      toast.success('Content deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to delete content');
    },
  });
}

export function useGetUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      if (hasMethod(actor, 'getCallerUserRole')) {
        return actor.getCallerUserRole();
      }
      if (hasMethod(actor, 'getUserRole')) {
        const role = await (actor as any).getUserRole();
        return role;
      }
      return 'guest';
    },
    enabled: !!actor && !isFetching,
  });
}

// Display Screen Queries
export function useGetActiveDisplayContent() {
  const { actor, isFetching } = useActor();

  return useQuery<DisplayScreenContent | null>({
    queryKey: ['displayContent', 'active'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getActiveDisplayContent')) return null;
      return (actor as any).getActiveDisplayContent();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useCreateDisplayScreenContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      file: any;
      contentType: 'movie' | 'music' | 'advertisement';
    }) => {
      if (!actor || !hasMethod(actor, 'createDisplayScreenContent')) {
        toast.error('Display content creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createDisplayScreenContent(
        params.title,
        params.description,
        params.file,
        params.contentType
      );
    },
    onSuccess: () => {
      toast.success('Display content created successfully');
      queryClient.invalidateQueries({ queryKey: ['displayContent'] });
    },
    onError: () => {
      toast.error('Failed to create display content');
    },
  });
}

export function useSetActiveDisplayContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: bigint) => {
      if (!actor || !hasMethod(actor, 'setActiveDisplayContent')) {
        toast.error('Setting active display not available');
        throw new Error('Method not available');
      }
      return (actor as any).setActiveDisplayContent(contentId);
    },
    onSuccess: () => {
      toast.success('Active display content updated');
      queryClient.invalidateQueries({ queryKey: ['displayContent'] });
    },
    onError: () => {
      toast.error('Failed to update active display content');
    },
  });
}

export function useDeleteDisplayContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteDisplayContent')) {
        toast.error('Display content deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteDisplayContent(contentId);
    },
    onSuccess: () => {
      toast.success('Display content deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['displayContent'] });
    },
    onError: () => {
      toast.error('Failed to delete display content');
    },
  });
}

// Category Queries
export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteCategory')) {
        toast.error('Category deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteCategory(categoryId);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });
}

// Wallet Queries
export function useCreateWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recoverySeed: string) => {
      if (!actor || !hasMethod(actor, 'createWallet')) {
        toast.info('Wallet creation coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).createWallet(recoverySeed);
    },
    onSuccess: () => {
      toast.success('Wallet created successfully');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: () => {
      toast.error('Failed to create wallet');
    },
  });
}

export function useGetWalletInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<WalletInfoPublic | null>({
    queryKey: ['wallet'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getWalletInfo')) return null;
      return (actor as any).getWalletInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLoadWallet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { amount: bigint; method: string }) => {
      if (!actor || !hasMethod(actor, 'loadWallet')) {
        toast.info('Wallet loading coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).loadWallet(params.amount, params.method);
    },
    onSuccess: () => {
      toast.success('Wallet loaded successfully');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: () => {
      toast.error('Failed to load wallet');
    },
  });
}

// Advertisement Queries
export function useGetAllAds() {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['ads'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAllAds')) return [];
      return (actor as any).getAllAds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdsByPlacement(placement: AdPlacement) {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['ads', 'placement', placement],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAdsByPlacement')) return [];
      return (actor as any).getAdsByPlacement(placement);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      imageUrl: string;
      targetUrl: string;
      placement: AdPlacement;
      adType: AdType;
    }) => {
      if (!actor || !hasMethod(actor, 'createAd')) {
        toast.error('Ad creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createAd(
        params.title,
        params.content,
        params.imageUrl,
        params.targetUrl,
        params.placement,
        params.adType
      );
    },
    onSuccess: () => {
      toast.success('Ad created successfully');
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => {
      toast.error('Failed to create ad');
    },
  });
}

export function useUpdateAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      imageUrl: string;
      targetUrl: string;
      placement: AdPlacement;
      adType: AdType;
    }) => {
      if (!actor || !hasMethod(actor, 'updateAd')) {
        toast.error('Ad update not available');
        throw new Error('Method not available');
      }
      return (actor as any).updateAd(
        params.id,
        params.title,
        params.content,
        params.imageUrl,
        params.targetUrl,
        params.placement,
        params.adType
      );
    },
    onSuccess: () => {
      toast.success('Ad updated successfully');
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => {
      toast.error('Failed to update ad');
    },
  });
}

export function useDeleteAd() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteAd')) {
        toast.error('Ad deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteAd(adId);
    },
    onSuccess: () => {
      toast.success('Ad deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => {
      toast.error('Failed to delete ad');
    },
  });
}

export function useToggleAdActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor || !hasMethod(actor, 'toggleAdActive')) {
        toast.error('Ad toggle not available');
        throw new Error('Method not available');
      }
      return (actor as any).toggleAdActive(adId);
    },
    onSuccess: () => {
      toast.success('Ad status updated');
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
    onError: () => {
      toast.error('Failed to toggle ad status');
    },
  });
}

export function useTrackAdView() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor || !hasMethod(actor, 'trackAdView')) return;
      return (actor as any).trackAdView(adId);
    },
  });
}

export function useTrackAdClick() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor || !hasMethod(actor, 'trackAdClick')) return;
      return (actor as any).trackAdClick(adId);
    },
  });
}

// Affiliate Queries
export function useGetAllAffiliateTiers() {
  const { actor, isFetching } = useActor();

  return useQuery<AffiliateTier[]>({
    queryKey: ['affiliateTiers'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAllAffiliateTiers')) return [];
      return (actor as any).getAllAffiliateTiers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAffiliateTier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      commissionRate: bigint;
      minReferrals: bigint;
    }) => {
      if (!actor || !hasMethod(actor, 'createAffiliateTier')) {
        toast.error('Affiliate tier creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createAffiliateTier(
        params.name,
        params.commissionRate,
        params.minReferrals
      );
    },
    onSuccess: () => {
      toast.success('Affiliate tier created successfully');
      queryClient.invalidateQueries({ queryKey: ['affiliateTiers'] });
    },
    onError: () => {
      toast.error('Failed to create affiliate tier');
    },
  });
}

export function useGetUserReferralLink() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralLink | null>({
    queryKey: ['referralLink'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getUserReferralLink')) return null;
      return (actor as any).getUserReferralLink();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateReferralLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !hasMethod(actor, 'generateReferralLink')) {
        toast.error('Referral link generation not available');
        throw new Error('Method not available');
      }
      return (actor as any).generateReferralLink();
    },
    onSuccess: () => {
      toast.success('Referral link generated successfully');
      queryClient.invalidateQueries({ queryKey: ['referralLink'] });
    },
    onError: () => {
      toast.error('Failed to generate referral link');
    },
  });
}

// Terms and Conditions Queries
export function useGetActiveTerms() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsAndConditions | null>({
    queryKey: ['terms', 'active'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getActiveTerms')) return null;
      return (actor as any).getActiveTerms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTerms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      version: string;
    }) => {
      if (!actor || !hasMethod(actor, 'createTerms')) {
        toast.error('Terms creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createTerms(params.title, params.content, params.version);
    },
    onSuccess: () => {
      toast.success('Terms created successfully');
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
    onError: () => {
      toast.error('Failed to create terms');
    },
  });
}

// Chat Queries
export function useGetChatRoomMessages(roomId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', roomId.toString()],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getChatRoomMessages')) return [];
      return (actor as any).getChatRoomMessages(roomId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      roomId: bigint;
      content: string;
      messageType: MessageType;
      fileBlob?: any;
    }) => {
      if (!actor || !hasMethod(actor, 'sendChatMessage')) {
        toast.error('Send message not available');
        throw new Error('Method not available');
      }
      return (actor as any).sendChatMessage(
        params.roomId,
        params.content,
        params.messageType,
        params.fileBlob ? [params.fileBlob] : []
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.roomId.toString()] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

// Pending Approval Queries
export function useGetPendingContentSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingContent[]>({
    queryKey: ['pending', 'content'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingContentSubmissions')) return [];
      return (actor as any).getPendingContentSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePendingContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approvePendingContent')) {
        toast.error('Content approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approvePendingContent(id);
    },
    onSuccess: () => {
      toast.success('Content approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: () => {
      toast.error('Failed to approve content');
    },
  });
}

// Alias for backward compatibility
export const useApproveContentSubmission = useApprovePendingContent;

export function useRejectPendingContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectPendingContent')) {
        toast.error('Content rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectPendingContent(id);
    },
    onSuccess: () => {
      toast.success('Content rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject content');
    },
  });
}

// Alias for backward compatibility
export const useRejectContentSubmission = useRejectPendingContent;

export function useGetPendingMemberRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingMemberRegistration[]>({
    queryKey: ['pending', 'members'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingMemberRegistrations')) return [];
      return (actor as any).getPendingMemberRegistrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveMemberRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveMemberRegistration')) {
        toast.error('Member approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveMemberRegistration(id);
    },
    onSuccess: () => {
      toast.success('Member approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve member');
    },
  });
}

export function useRejectMemberRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectMemberRegistration')) {
        toast.error('Member rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectMemberRegistration(id);
    },
    onSuccess: () => {
      toast.success('Member rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject member');
    },
  });
}

export function useGetPendingAdminRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingAdminRequest[]>({
    queryKey: ['pending', 'admins'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingAdminRequests')) return [];
      return (actor as any).getPendingAdminRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveAdminRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveAdminRequest')) {
        toast.error('Admin approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveAdminRequest(id);
    },
    onSuccess: () => {
      toast.success('Admin approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve admin');
    },
  });
}

export function useRejectAdminRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectAdminRequest')) {
        toast.error('Admin rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectAdminRequest(id);
    },
    onSuccess: () => {
      toast.success('Admin rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject admin');
    },
  });
}

export function useGetPendingCardLoads() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingCardLoad[]>({
    queryKey: ['pending', 'cardLoads'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingCardLoads')) return [];
      return (actor as any).getPendingCardLoads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveCardLoad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveCardLoad')) {
        toast.error('Card load approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveCardLoad(id);
    },
    onSuccess: () => {
      toast.success('Card load approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve card load');
    },
  });
}

export function useRejectCardLoad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectCardLoad')) {
        toast.error('Card load rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectCardLoad(id);
    },
    onSuccess: () => {
      toast.success('Card load rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject card load');
    },
  });
}

export function useGetPendingPriceUpdates() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingPriceUpdate[]>({
    queryKey: ['pending', 'priceUpdates'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingPriceUpdates')) return [];
      return (actor as any).getPendingPriceUpdates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePriceUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approvePriceUpdate')) {
        toast.error('Price update approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approvePriceUpdate(id);
    },
    onSuccess: () => {
      toast.success('Price update approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve price update');
    },
  });
}

export function useRejectPriceUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectPriceUpdate')) {
        toast.error('Price update rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectPriceUpdate(id);
    },
    onSuccess: () => {
      toast.success('Price update rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject price update');
    },
  });
}

export function useGetPendingAffiliatePayouts() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingAffiliatePayout[]>({
    queryKey: ['pending', 'payouts'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingAffiliatePayouts')) return [];
      return (actor as any).getPendingAffiliatePayouts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveAffiliatePayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveAffiliatePayout')) {
        toast.error('Payout approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveAffiliatePayout(id);
    },
    onSuccess: () => {
      toast.success('Payout approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve payout');
    },
  });
}

export function useRejectAffiliatePayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectAffiliatePayout')) {
        toast.error('Payout rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectAffiliatePayout(id);
    },
    onSuccess: () => {
      toast.success('Payout rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject payout');
    },
  });
}

// HiiYah Chat Broadcast Queries
export function useGetPendingBroadcastRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingBroadcastRequest[]>({
    queryKey: ['pending', 'broadcasts'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingBroadcastRequests')) return [];
      return (actor as any).getPendingBroadcastRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveBroadcastRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveBroadcastRequest')) {
        toast.error('Broadcast approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveBroadcastRequest(id);
    },
    onSuccess: () => {
      toast.success('Broadcast approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve broadcast');
    },
  });
}

export function useRejectBroadcastRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectBroadcastRequest')) {
        toast.error('Broadcast rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectBroadcastRequest(id);
    },
    onSuccess: () => {
      toast.success('Broadcast rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject broadcast');
    },
  });
}

export function useGetPendingHeroJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingHeroJoinRequest[]>({
    queryKey: ['pending', 'heroJoins'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getPendingHeroJoinRequests')) return [];
      return (actor as any).getPendingHeroJoinRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveHeroJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'approveHeroJoinRequest')) {
        toast.error('Hero join approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveHeroJoinRequest(id);
    },
    onSuccess: () => {
      toast.success('Hero join approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve hero join');
    },
  });
}

export function useRejectHeroJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectHeroJoinRequest')) {
        toast.error('Hero join rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectHeroJoinRequest(id);
    },
    onSuccess: () => {
      toast.success('Hero join rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject hero join');
    },
  });
}

// Approve All Pending Items - Frontend-only composite mutation
export function useApproveAllPendingItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      const results = [];
      
      // This is a placeholder - in a real implementation, you would need to:
      // 1. Fetch all pending items from all categories
      // 2. Call approve methods for each one
      // 3. Handle errors gracefully
      
      // For now, just invalidate all pending queries to trigger a refresh
      toast.info('Bulk approval feature coming soon');
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      toast.success('All pending items approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: (error: any) => {
      if (error.message !== 'Not implemented') {
        toast.error('Failed to approve all items');
      }
    },
  });
}

// User Profile Mutation
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: any) => {
      if (!actor || !hasMethod(actor, 'saveCallerUserProfile')) {
        toast.error('Profile save not available');
        throw new Error('Method not available');
      }
      return (actor as any).saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      toast.success('Profile saved successfully');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: () => {
      toast.error('Failed to save profile');
    },
  });
}
