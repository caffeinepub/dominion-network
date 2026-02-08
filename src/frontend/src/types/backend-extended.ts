// Extended types for frontend use when backend methods are not yet implemented
// These types match the expected backend structure but are used for type safety only

export type MediaType = 'video' | 'audio' | 'image';

export interface MediaContent {
  id: bigint;
  title: string;
  description: string;
  duration: bigint;
  file: any;
  thumbnail: any;
  mediaType: MediaType;
  categories: bigint[];
  uploadedBy: string;
  uploadTime: bigint;
  views: bigint;
  rating: bigint;
}

export interface Category {
  id: bigint;
  name: string;
}

export type DisplayContentType = 'movie' | 'music' | 'advertisement';

export interface DisplayScreenContent {
  id: bigint;
  title: string;
  description: string;
  file: any;
  contentType: DisplayContentType;
  uploadedBy: string;
  uploadTime: bigint;
  isActive: boolean;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface PendingContent {
  id: bigint;
  content: MediaContent;
  submittedBy: string;
  submittedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingMemberRegistration {
  id: bigint;
  principal: string;
  name: string;
  email: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingAdminRequest {
  id: bigint;
  principal: string;
  name: string;
  email: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingCardLoad {
  id: bigint;
  userId: string;
  amount: bigint;
  method: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingPriceUpdate {
  id: bigint;
  itemId: bigint;
  itemType: string;
  oldPrice: bigint;
  newPrice: bigint;
  requestedBy: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingAffiliatePayout {
  id: bigint;
  userId: string;
  amount: bigint;
  commissionDetails: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingBroadcastRequest {
  id: bigint;
  userId: string;
  title: string;
  description: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export interface PendingHeroJoinRequest {
  id: bigint;
  roomId: bigint;
  requestedBy: string;
  requestedAt: bigint;
  status: ApprovalStatus;
}

export type AdPlacement = 'homepage' | 'category' | 'mall';
export type AdType = 'banner' | 'sidebar';

export interface Advertisement {
  id: bigint;
  title: string;
  content: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  adType: AdType;
  active: boolean;
  createdAt: bigint;
  views: bigint;
  clicks: bigint;
}

export interface AffiliateTier {
  id: bigint;
  name: string;
  commissionRate: bigint;
  minReferrals: bigint;
}

export interface ReferralLink {
  id: bigint;
  userId: string;
  code: string;
  createdAt: bigint;
  views: bigint;
  clicks: bigint;
  conversions: bigint;
}

export interface TransactionInfo {
  transactionId: string;
  amount: bigint;
  recipientAddress: string;
  timestamp: bigint;
  transactionType: 'incoming' | 'outgoing' | 'walletLoad' | 'purchase' | 'affiliatePayout';
}

export interface WalletInfoPublic {
  walletAddress: string;
  balance: bigint;
  transactionHistory: TransactionInfo[];
}

export interface TermsAndConditions {
  id: bigint;
  title: string;
  content: string;
  createdAt: bigint;
  version: string;
  isActive: boolean;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export interface ChatMessage {
  id: bigint;
  roomId: bigint;
  sender: string;
  content: string;
  messageType: MessageType;
  timestamp: bigint;
  fileBlob?: any;
}

export type TransactionType = 'incoming' | 'outgoing' | 'walletLoad' | 'purchase' | 'affiliatePayout';

export interface MagicLinkInvitation {
  id: bigint;
  email: string;
  token: string;
  createdAt: bigint;
  expiresAt: bigint;
  used: boolean;
}

export interface ImageLibraryItem {
  id: bigint;
  title: string;
  description: string;
  image: any;
  uploadTime: bigint;
  status: ApprovalStatus;
}

export interface UserProfileInfo {
  principal: string;
  name: string;
  email: string;
  role: string;
}
