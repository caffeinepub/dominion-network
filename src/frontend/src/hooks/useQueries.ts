import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
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

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'isCallerAdmin')) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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

  const query = useQuery<any>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getCallerUserProfile')) return null;
      return (actor as any).getCallerUserProfile();
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
      active: boolean;
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
        params.adType,
        params.active
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
export function useGetAffiliateTiers() {
  const { actor, isFetching } = useActor();

  return useQuery<AffiliateTier[]>({
    queryKey: ['affiliateTiers'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getAffiliateTiers')) return [];
      return (actor as any).getAffiliateTiers();
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
    mutationFn: async (tierId: bigint) => {
      if (!actor || !hasMethod(actor, 'deleteAffiliateTier')) {
        toast.error('Affiliate tier deletion not available');
        throw new Error('Method not available');
      }
      return (actor as any).deleteAffiliateTier(tierId);
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

export function useGetReferralLink() {
  const { actor, isFetching } = useActor();

  return useQuery<ReferralLink | null>({
    queryKey: ['referralLink'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getReferralLink')) return null;
      return (actor as any).getReferralLink();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrackReferralClick() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor || !hasMethod(actor, 'trackReferralClick')) return;
      return (actor as any).trackReferralClick(code);
    },
  });
}

// Approval Queries
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

export function useRequestMemberRegistration() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { name: string; email: string }) => {
      if (!actor || !hasMethod(actor, 'requestMemberRegistration')) {
        toast.info('Registration request coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).requestMemberRegistration(params.name, params.email);
    },
    onSuccess: () => {
      toast.success('Registration request submitted');
    },
  });
}

// Approval Actions
export function useApproveContentSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveContentSubmission')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveContentSubmission(pendingId);
    },
    onSuccess: () => {
      toast.success('Content approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
    },
    onError: () => {
      toast.error('Failed to approve content');
    },
  });
}

export function useRejectContentSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectContentSubmission')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectContentSubmission(pendingId);
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

export function useApproveMemberRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveMemberRegistration')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveMemberRegistration(pendingId);
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
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectMemberRegistration')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectMemberRegistration(pendingId);
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

export function useApproveAdminRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveAdminRequest')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveAdminRequest(pendingId);
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
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectAdminRequest')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectAdminRequest(pendingId);
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

export function useApproveCardLoad() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveCardLoad')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveCardLoad(pendingId);
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
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectCardLoad')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectCardLoad(pendingId);
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

export function useApprovePriceUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approvePriceUpdate')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approvePriceUpdate(pendingId);
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
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectPriceUpdate')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectPriceUpdate(pendingId);
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

export function useApproveAffiliatePayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveAffiliatePayout')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveAffiliatePayout(pendingId);
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
    mutationFn: async (pendingId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectAffiliatePayout')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectAffiliatePayout(pendingId);
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

export function useApproveBroadcastRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveBroadcastRequest')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveBroadcastRequest(requestId);
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
    mutationFn: async (requestId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectBroadcastRequest')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectBroadcastRequest(requestId);
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

export function useApproveHeroJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor || !hasMethod(actor, 'approveHeroJoinRequest')) {
        toast.error('Approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveHeroJoinRequest(requestId);
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
    mutationFn: async (requestId: bigint) => {
      if (!actor || !hasMethod(actor, 'rejectHeroJoinRequest')) {
        toast.error('Rejection not available');
        throw new Error('Method not available');
      }
      return (actor as any).rejectHeroJoinRequest(requestId);
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

export function useApproveAllPendingItems() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor || !hasMethod(actor, 'approveAllPendingItems')) {
        toast.error('Bulk approval not available');
        throw new Error('Method not available');
      }
      return (actor as any).approveAllPendingItems();
    },
    onSuccess: () => {
      toast.success('All pending items approved');
      queryClient.invalidateQueries({ queryKey: ['pending'] });
      queryClient.invalidateQueries({ queryKey: ['imageLibrary'] });
    },
    onError: () => {
      toast.error('Failed to approve all items');
    },
  });
}

// Terms and Conditions Queries
export function useGetActiveTermsAndConditions() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsAndConditions | null>({
    queryKey: ['terms', 'active'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getActiveTermsAndConditions')) return null;
      return (actor as any).getActiveTermsAndConditions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTermsAndConditionsVersions() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsAndConditions[]>({
    queryKey: ['terms', 'versions'],
    queryFn: async () => {
      if (!actor || !hasMethod(actor, 'getTermsAndConditionsVersions')) return [];
      return (actor as any).getTermsAndConditionsVersions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTermsAndConditions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      content: string;
      version: string;
      isActive: boolean;
    }) => {
      if (!actor || !hasMethod(actor, 'createTermsAndConditions')) {
        toast.error('Terms creation not available');
        throw new Error('Method not available');
      }
      return (actor as any).createTermsAndConditions(
        params.title,
        params.content,
        params.version,
        params.isActive
      );
    },
    onSuccess: () => {
      toast.success('Terms and Conditions created');
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
    onError: () => {
      toast.error('Failed to create Terms and Conditions');
    },
  });
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
      isActive: boolean;
    }) => {
      if (!actor || !hasMethod(actor, 'updateTermsAndConditions')) {
        toast.error('Terms update not available');
        throw new Error('Method not available');
      }
      return (actor as any).updateTermsAndConditions(
        params.id,
        params.title,
        params.content,
        params.version,
        params.isActive
      );
    },
    onSuccess: () => {
      toast.success('Terms and Conditions updated');
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
    onError: () => {
      toast.error('Failed to update Terms and Conditions');
    },
  });
}

// Chat Queries
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
        toast.info('Chat messaging coming soon');
        throw new Error('Method not available');
      }
      return (actor as any).sendChatMessage(
        params.roomId,
        params.content,
        params.messageType,
        params.fileBlob
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', variables.roomId.toString()] });
    },
  });
}
