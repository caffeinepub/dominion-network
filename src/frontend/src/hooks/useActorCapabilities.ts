import { useActor } from './useActor';
import { useMemo } from 'react';

export interface ActorCapabilities {
  // Content management
  hasGetAllContent: boolean;
  hasAddContent: boolean;
  hasDeleteContent: boolean;
  hasGetPendingContentSubmissions: boolean;
  hasApproveContentSubmission: boolean;
  hasRejectContentSubmission: boolean;
  
  // Image library
  hasListPendingImages: boolean;
  hasListApprovedImages: boolean;
  hasUploadImage: boolean;
  hasApproveImage: boolean;
  hasRejectImage: boolean;
  hasDownloadImage: boolean;
  hasEraseAllImages: boolean;
  
  // Member management
  hasGetPendingMemberRegistrations: boolean;
  hasApproveMemberRegistration: boolean;
  hasRejectMemberRegistration: boolean;
  
  // Admin management
  hasGetPendingAdminRequests: boolean;
  hasApproveAdminRequest: boolean;
  hasRejectAdminRequest: boolean;
  
  // Card loads
  hasGetPendingCardLoads: boolean;
  hasApproveCardLoad: boolean;
  hasRejectCardLoad: boolean;
  
  // Price updates
  hasGetPendingPriceUpdates: boolean;
  hasApprovePriceUpdate: boolean;
  hasRejectPriceUpdate: boolean;
  
  // Affiliate payouts
  hasGetPendingAffiliatePayouts: boolean;
  hasApproveAffiliatePayout: boolean;
  hasRejectAffiliatePayout: boolean;
  
  // Broadcast requests
  hasGetPendingBroadcastRequests: boolean;
  hasApproveBroadcastRequest: boolean;
  hasRejectBroadcastRequest: boolean;
  
  // Hero join requests
  hasGetPendingHeroJoinRequests: boolean;
  hasApproveHeroJoinRequest: boolean;
  hasRejectHeroJoinRequest: boolean;
  
  // Bulk operations
  hasApproveAllPendingItems: boolean;
  
  // Media upload
  hasUploadMedia: boolean;
  
  // Display content
  hasGetDisplayContent: boolean;
  hasUploadDisplayContent: boolean;
  
  // Ads
  hasGetAllAds: boolean;
  hasCreateAd: boolean;
  hasUpdateAd: boolean;
  hasDeleteAd: boolean;
  hasToggleAdActive: boolean;
  
  // Mall
  hasGetAllMallItems: boolean;
  hasCreateMallItem: boolean;
  hasUpdateMallItem: boolean;
  hasDeleteMallItem: boolean;
}

export function useActorCapabilities(): ActorCapabilities & { isLoading: boolean } {
  const { actor, isFetching } = useActor();

  const capabilities = useMemo(() => {
    if (!actor) {
      return {
        hasGetAllContent: false,
        hasAddContent: false,
        hasDeleteContent: false,
        hasGetPendingContentSubmissions: false,
        hasApproveContentSubmission: false,
        hasRejectContentSubmission: false,
        hasListPendingImages: false,
        hasListApprovedImages: false,
        hasUploadImage: false,
        hasApproveImage: false,
        hasRejectImage: false,
        hasDownloadImage: false,
        hasEraseAllImages: false,
        hasGetPendingMemberRegistrations: false,
        hasApproveMemberRegistration: false,
        hasRejectMemberRegistration: false,
        hasGetPendingAdminRequests: false,
        hasApproveAdminRequest: false,
        hasRejectAdminRequest: false,
        hasGetPendingCardLoads: false,
        hasApproveCardLoad: false,
        hasRejectCardLoad: false,
        hasGetPendingPriceUpdates: false,
        hasApprovePriceUpdate: false,
        hasRejectPriceUpdate: false,
        hasGetPendingAffiliatePayouts: false,
        hasApproveAffiliatePayout: false,
        hasRejectAffiliatePayout: false,
        hasGetPendingBroadcastRequests: false,
        hasApproveBroadcastRequest: false,
        hasRejectBroadcastRequest: false,
        hasGetPendingHeroJoinRequests: false,
        hasApproveHeroJoinRequest: false,
        hasRejectHeroJoinRequest: false,
        hasApproveAllPendingItems: false,
        hasUploadMedia: false,
        hasGetDisplayContent: false,
        hasUploadDisplayContent: false,
        hasGetAllAds: false,
        hasCreateAd: false,
        hasUpdateAd: false,
        hasDeleteAd: false,
        hasToggleAdActive: false,
        hasGetAllMallItems: false,
        hasCreateMallItem: false,
        hasUpdateMallItem: false,
        hasDeleteMallItem: false,
      };
    }

    return {
      hasGetAllContent: typeof (actor as any).getAllContent === 'function',
      hasAddContent: typeof (actor as any).addContent === 'function',
      hasDeleteContent: typeof (actor as any).deleteContent === 'function',
      hasGetPendingContentSubmissions: typeof (actor as any).getPendingContentSubmissions === 'function',
      hasApproveContentSubmission: typeof (actor as any).approveContentSubmission === 'function',
      hasRejectContentSubmission: typeof (actor as any).rejectContentSubmission === 'function',
      hasListPendingImages: typeof (actor as any).listPendingImages === 'function',
      hasListApprovedImages: typeof (actor as any).listApprovedImages === 'function',
      hasUploadImage: typeof (actor as any).uploadImage === 'function',
      hasApproveImage: typeof (actor as any).approveImage === 'function',
      hasRejectImage: typeof (actor as any).rejectImage === 'function',
      hasDownloadImage: typeof (actor as any).downloadImage === 'function',
      hasEraseAllImages: typeof (actor as any).eraseAllImages === 'function',
      hasGetPendingMemberRegistrations: typeof (actor as any).getPendingMemberRegistrations === 'function',
      hasApproveMemberRegistration: typeof (actor as any).approveMemberRegistration === 'function',
      hasRejectMemberRegistration: typeof (actor as any).rejectMemberRegistration === 'function',
      hasGetPendingAdminRequests: typeof (actor as any).getPendingAdminRequests === 'function',
      hasApproveAdminRequest: typeof (actor as any).approveAdminRequest === 'function',
      hasRejectAdminRequest: typeof (actor as any).rejectAdminRequest === 'function',
      hasGetPendingCardLoads: typeof (actor as any).getPendingCardLoads === 'function',
      hasApproveCardLoad: typeof (actor as any).approveCardLoad === 'function',
      hasRejectCardLoad: typeof (actor as any).rejectCardLoad === 'function',
      hasGetPendingPriceUpdates: typeof (actor as any).getPendingPriceUpdates === 'function',
      hasApprovePriceUpdate: typeof (actor as any).approvePriceUpdate === 'function',
      hasRejectPriceUpdate: typeof (actor as any).rejectPriceUpdate === 'function',
      hasGetPendingAffiliatePayouts: typeof (actor as any).getPendingAffiliatePayouts === 'function',
      hasApproveAffiliatePayout: typeof (actor as any).approveAffiliatePayout === 'function',
      hasRejectAffiliatePayout: typeof (actor as any).rejectAffiliatePayout === 'function',
      hasGetPendingBroadcastRequests: typeof (actor as any).getPendingBroadcastRequests === 'function',
      hasApproveBroadcastRequest: typeof (actor as any).approveBroadcastRequest === 'function',
      hasRejectBroadcastRequest: typeof (actor as any).rejectBroadcastRequest === 'function',
      hasGetPendingHeroJoinRequests: typeof (actor as any).getPendingHeroJoinRequests === 'function',
      hasApproveHeroJoinRequest: typeof (actor as any).approveHeroJoinRequest === 'function',
      hasRejectHeroJoinRequest: typeof (actor as any).rejectHeroJoinRequest === 'function',
      hasApproveAllPendingItems: typeof (actor as any).approveAllPendingItems === 'function',
      hasUploadMedia: typeof (actor as any).uploadMedia === 'function',
      hasGetDisplayContent: typeof (actor as any).getDisplayContent === 'function',
      hasUploadDisplayContent: typeof (actor as any).uploadDisplayContent === 'function',
      hasGetAllAds: typeof (actor as any).getAllAds === 'function',
      hasCreateAd: typeof (actor as any).createAd === 'function',
      hasUpdateAd: typeof (actor as any).updateAd === 'function',
      hasDeleteAd: typeof (actor as any).deleteAd === 'function',
      hasToggleAdActive: typeof (actor as any).toggleAdActive === 'function',
      hasGetAllMallItems: typeof (actor as any).getAllMallItems === 'function',
      hasCreateMallItem: typeof (actor as any).createMallItem === 'function',
      hasUpdateMallItem: typeof (actor as any).updateMallItem === 'function',
      hasDeleteMallItem: typeof (actor as any).deleteMallItem === 'function',
    };
  }, [actor]);

  return {
    ...capabilities,
    isLoading: isFetching,
  };
}
