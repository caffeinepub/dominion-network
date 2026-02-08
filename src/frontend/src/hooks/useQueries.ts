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

// Admin Check Query - keyed by principal to prevent stale cache
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalKey = identity?.getPrincipal().toString() || 'anonymous';

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', principalKey],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'isCallerAdmin')) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Admin check error:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
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

  const query = useQuery<any>({
    queryKey: ['currentUserProfile'],
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

// Category Queries
export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteCategory')) {
        toast.info('Category deletion coming soon');
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

export function useGetWalletInfo(walletAddress: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WalletInfoPublic | null>({
    queryKey: ['wallet', walletAddress],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getWalletInfo')) return null;
      return (actor as any).getWalletInfo(walletAddress);
    },
    enabled: !!actor && !isFetching && !!walletAddress,
    refetchInterval: 30000,
  });
}

export function useGetAllWalletRecoverySeeds() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['walletRecoverySeeds'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAllWalletRecoverySeeds')) return [];
      return (actor as any).getAllWalletRecoverySeeds();
    },
    enabled: !!actor && !isFetching,
  });
}

// Advertisement Queries
export function useGetAllAdvertisements() {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['advertisements', 'all'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAllAdvertisements')) return [];
      return (actor as any).getAllAdvertisements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdvertisementsByPlacement(placement: AdPlacement) {
  const { actor, isFetching } = useActor();

  return useQuery<Advertisement[]>({
    queryKey: ['advertisements', 'placement', placement],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAdvertisementsByPlacement')) return [];
      return (actor as any).getAdvertisementsByPlacement(placement);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAdvertisement() {
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
      if (!actor || !hasMethod(actor, 'createAdvertisement')) {
        toast.error('Advertisement creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createAdvertisement(
        params.title,
        params.content,
        params.imageUrl,
        params.targetUrl,
        params.placement,
        params.adType
      );
    },
    onSuccess: () => {
      toast.success('Advertisement created successfully');
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
    },
    onError: () => {
      toast.error('Failed to create advertisement');
    },
  });
}

export function useUpdateAdvertisement() {
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
      if (!actor || !hasMethod(actor, 'updateAdvertisement')) {
        toast.error('Advertisement update not available');
        throw new Error('Method not available');
      }
      return (actor as any).updateAdvertisement(
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
      toast.success('Advertisement updated successfully');
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
    },
    onError: () => {
      toast.error('Failed to update advertisement');
    },
  });
}

export function useToggleAdvertisementActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'toggleAdvertisementActive')) {
        toast.error('Advertisement toggle not available');
        throw new Error('Method not available');
      }
      return (actor as any).toggleAdvertisementActive(id);
    },
    onSuccess: () => {
      toast.success('Advertisement status updated');
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
    },
    onError: () => {
      toast.error('Failed to update advertisement status');
    },
  });
}

export function useDeleteAdvertisement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteAdvertisement')) {
        toast.error('Advertisement deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteAdvertisement(id);
    },
    onSuccess: () => {
      toast.success('Advertisement deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
    },
    onError: () => {
      toast.error('Failed to delete advertisement');
    },
  });
}

export function useTrackAdView() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'trackAdView')) return;
      return (actor as any).trackAdView(id);
    },
  });
}

export function useTrackAdClick() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'trackAdClick')) return;
      return (actor as any).trackAdClick(id);
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

export function useDeleteAffiliateTier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteAffiliateTier')) {
        toast.info('Affiliate tier deletion coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).deleteAffiliateTier(id);
    },
    onSuccess: () => {
      toast.success('Affiliate tier deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['affiliateTiers'] });
    },
    onError: () => {
      toast.error('Failed to delete affiliate tier');
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

export function useGetActiveTermsAndConditions() {
  return useGetActiveTerms();
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

export function useCreateTermsAndConditions() {
  return useCreateTerms();
}

export function useUpdateTermsAndConditions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      content: string;
      version: string;
    }) => {
      if (!actor || !hasMethod(actor, 'updateTerms')) {
        toast.info('Terms update coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).updateTerms(params.id, params.title, params.content, params.version);
    },
    onSuccess: () => {
      toast.success('Terms updated successfully');
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
    onError: () => {
      toast.error('Failed to update terms');
    },
  });
}

// Chat Queries
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
        toast.error('Chat message sending not available');
        throw new Error('Method not available');
      }
      return (actor as any).sendChatMessage(
        params.roomId,
        params.content,
        params.messageType,
        params.fileBlob ? [params.fileBlob] : []
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

export function useGetChatMessages(roomId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages', roomId.toString()],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getChatMessages')) return [];
      return (actor as any).getChatMessages(roomId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
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
      toast.success('Broadcast request approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve broadcast request');
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
      toast.success('Broadcast request rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject broadcast request');
    },
  });
}

export function useGetPendingHeroJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingHeroJoinRequest[]>({
    queryKey: ['pending', 'heroJoin'],
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
      toast.success('Hero join request approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve hero join request');
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
      toast.success('Hero join request rejected');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to reject hero join request');
    },
  });
}

// User Profile Management
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

// Stub hooks for missing backend functionality
export function useGetPendingMemberRegistrations() {
  return useQuery<PendingMemberRegistration[]>({
    queryKey: ['pending', 'members'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetPendingAdminRequests() {
  return useQuery<PendingAdminRequest[]>({
    queryKey: ['pending', 'admins'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetPendingCardLoads() {
  return useQuery<PendingCardLoad[]>({
    queryKey: ['pending', 'cardLoads'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetPendingPriceUpdates() {
  return useQuery<PendingPriceUpdate[]>({
    queryKey: ['pending', 'priceUpdates'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useGetPendingAffiliatePayouts() {
  return useQuery<PendingAffiliatePayout[]>({
    queryKey: ['pending', 'payouts'],
    queryFn: async () => [],
    enabled: false,
  });
}

export function useApproveContentSubmission() {
  return useApprovePendingContent();
}

export function useRejectContentSubmission() {
  return useRejectPendingContent();
}

export function useApproveMemberRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Member registration approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRejectMemberRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Member registration rejection coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useApproveAdminRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Admin request approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRejectAdminRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Admin request rejection coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useApproveCardLoad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Card load approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRejectCardLoad() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Card load rejection coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useApprovePriceUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Price update approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRejectPriceUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Price update rejection coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useApproveAffiliatePayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Affiliate payout approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRejectAffiliatePayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      toast.info('Affiliate payout rejection coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useApproveAllPendingItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      toast.info('Bulk approval coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
  });
}

export function useRequestMemberRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { name: string; email: string; password: string }) => {
      toast.info('Member registration coming soon');
    },
    onSuccess: () => {
      toast.success('Registration request submitted');
    },
  });
}
