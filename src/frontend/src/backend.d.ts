import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface WalletInfoPublic {
    balance: bigint;
    walletAddress: string;
    transactionHistory: Array<TransactionInfo>;
}
export type Time = bigint;
export interface Advertisement {
    id: bigint;
    clicks: bigint;
    title: string;
    active: boolean;
    content: string;
    placement: AdPlacement;
    views: bigint;
    createdAt: bigint;
    targetUrl: string;
    imageUrl: string;
    adType: AdType;
}
export interface PendingPriceUpdate {
    id: bigint;
    status: ApprovalStatus;
    itemId: bigint;
    itemType: string;
    oldPrice: bigint;
    newPrice: bigint;
    requestedAt: bigint;
    requestedBy: Principal;
}
export interface PaymentSuccessResponse {
    message: string;
    payment: {
        status: string;
        paymentMethod: {
            last4: string;
            brand: string;
        };
        currency: string;
        amount: bigint;
    };
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface PendingHeroJoinRequest {
    id: bigint;
    status: ApprovalStatus;
    roomId: bigint;
    requestedAt: bigint;
    requestedBy: Principal;
}
export interface ImageLibraryItem {
    id: bigint;
    status: ApprovalStatus;
    title: string;
    description: string;
    image: ExternalBlob;
    uploadTime: bigint;
}
export interface PendingContent {
    id: bigint;
    status: ApprovalStatus;
    content: MediaContent;
    submittedAt: bigint;
    submittedBy: Principal;
}
export interface PendingAdminRequest {
    id: bigint;
    status: ApprovalStatus;
    principal: Principal;
    name: string;
    email: string;
    requestedAt: bigint;
}
export interface PaymentCancelResponse {
    message: string;
    sessionId: string;
}
export interface PendingCardLoad {
    id: bigint;
    status: ApprovalStatus;
    method: string;
    userId: Principal;
    amount: bigint;
    requestedAt: bigint;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    fileBlob?: ExternalBlob;
    sender: Principal;
    messageType: MessageType;
    timestamp: bigint;
    roomId: bigint;
}
export interface AffiliateTier {
    id: bigint;
    name: string;
    minReferrals: bigint;
    commissionRate: bigint;
}
export interface Category {
    id: bigint;
    name: string;
}
export interface PendingMemberRegistration {
    id: bigint;
    status: ApprovalStatus;
    principal: Principal;
    name: string;
    email: string;
    requestedAt: bigint;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface DisplayScreenContent {
    id: bigint;
    title: string;
    contentType: DisplayContentType;
    file: ExternalBlob;
    description: string;
    isActive: boolean;
    uploadTime: bigint;
    uploadedBy: Principal;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface TransactionInfo {
    transactionType: Variant_incoming_walletLoad_affiliatePayout_outgoing_purchase;
    timestamp: bigint;
    recipientAddress: string;
    amount: bigint;
    transactionId: string;
}
export interface TermsAndConditions {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    isActive: boolean;
    version: string;
}
export interface PendingAffiliatePayout {
    id: bigint;
    status: ApprovalStatus;
    userId: Principal;
    commissionDetails: string;
    amount: bigint;
    requestedAt: bigint;
}
export interface WalletInfo {
    balance: bigint;
    recoverySeed: string;
    walletAddress: string;
    transactionHistory: Array<TransactionInfo>;
}
export interface MediaContent {
    id: bigint;
    categories: Array<bigint>;
    title: string;
    duration: bigint;
    thumbnail: ExternalBlob;
    views: bigint;
    file: ExternalBlob;
    description: string;
    mediaType: MediaType;
    rating: bigint;
    uploadTime: bigint;
    uploadedBy: Principal;
}
export interface PendingBroadcastRequest {
    id: bigint;
    status: ApprovalStatus;
    title: string;
    userId: Principal;
    description: string;
    requestedAt: bigint;
}
export interface UserProfile {
    name: string;
    role: Role;
    isOnline: boolean;
    walletAddress: string;
    email: string;
    creditCardNumber: string;
    viewingHistory: Array<bigint>;
}
export enum AdPlacement {
    mall = "mall",
    homepage = "homepage",
    category = "category"
}
export enum AdType {
    banner = "banner",
    sidebar = "sidebar"
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ChatType {
    group = "group",
    direct = "direct",
    broadcast = "broadcast"
}
export enum DisplayContentType {
    movie = "movie",
    music = "music",
    advertisement = "advertisement"
}
export enum MediaType {
    audio = "audio",
    video = "video",
    image = "image"
}
export enum MessageType {
    audio = "audio",
    video = "video",
    file = "file",
    text = "text",
    image = "image"
}
export enum Role {
    member = "member",
    admin = "admin",
    subscriber = "subscriber"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_incoming_walletLoad_affiliatePayout_outgoing_purchase {
    incoming = "incoming",
    walletLoad = "walletLoad",
    affiliatePayout = "affiliatePayout",
    outgoing = "outgoing",
    purchase = "purchase"
}
export interface backendInterface {
    addTransaction(txInfo: TransactionInfo): Promise<void>;
    approveAdminRequest(id: bigint, approved: boolean): Promise<void>;
    approveAffiliatePayout(id: bigint, approved: boolean): Promise<void>;
    approveBroadcastRequest(id: bigint, approved: boolean): Promise<void>;
    approveCardLoad(id: bigint, approved: boolean): Promise<void>;
    approveHeroJoinRequest(id: bigint, approved: boolean): Promise<void>;
    approveImageLibraryItem(id: bigint, approved: boolean): Promise<void>;
    approveMemberRegistration(id: bigint, approved: boolean): Promise<void>;
    approvePendingContent(id: bigint, approved: boolean): Promise<void>;
    approvePriceUpdate(id: bigint, approved: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAdvertisement(ad: Advertisement): Promise<bigint>;
    createAffiliateTier(tier: AffiliateTier): Promise<bigint>;
    createCategory(name: string): Promise<bigint>;
    createChatRoom(name: string, chatType: ChatType): Promise<bigint>;
    createTerms(title: string, content: string, version: string): Promise<bigint>;
    createWallet(address: string, seed: string): Promise<void>;
    deleteAdvertisement(id: bigint): Promise<void>;
    deleteAffiliateTier(id: bigint): Promise<void>;
    deleteCategory(id: bigint): Promise<void>;
    deleteContent(id: bigint): Promise<void>;
    deleteDisplayContent(id: bigint): Promise<void>;
    generateInviteCode(): Promise<string>;
    getActiveAdvertisements(): Promise<Array<Advertisement>>;
    getActiveDisplayContent(): Promise<Array<DisplayScreenContent>>;
    getActiveTerms(): Promise<TermsAndConditions | null>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWallet(): Promise<WalletInfoPublic | null>;
    getCallerWalletWithSeed(): Promise<WalletInfo | null>;
    getChatRoomMessages(roomId: bigint): Promise<Array<ChatMessage>>;
    getContent(id: bigint): Promise<MediaContent | null>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listAffiliateTiers(): Promise<Array<AffiliateTier>>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listCategories(): Promise<Array<Category>>;
    listContent(): Promise<Array<MediaContent>>;
    listImageLibraryItems(): Promise<Array<ImageLibraryItem>>;
    listPendingAdminRequests(): Promise<Array<PendingAdminRequest>>;
    listPendingAffiliatePayouts(): Promise<Array<PendingAffiliatePayout>>;
    listPendingBroadcastRequests(): Promise<Array<PendingBroadcastRequest>>;
    listPendingCardLoads(): Promise<Array<PendingCardLoad>>;
    listPendingContent(): Promise<Array<PendingContent>>;
    listPendingHeroJoinRequests(): Promise<Array<PendingHeroJoinRequest>>;
    listPendingMemberRegistrations(): Promise<Array<PendingMemberRegistration>>;
    listPendingPriceUpdates(): Promise<Array<PendingPriceUpdate>>;
    paymentCancel(sessionId: string): Promise<PaymentCancelResponse>;
    paymentSuccess(sessionId: string, accountId: string, caffeineCustomerId: string): Promise<PaymentSuccessResponse>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(roomId: bigint, content: string, messageType: MessageType, fileBlob: ExternalBlob | null): Promise<bigint>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    updateAdvertisement(id: bigint, ad: Advertisement): Promise<void>;
    updateAffiliateTier(id: bigint, tier: AffiliateTier): Promise<void>;
    updateCategory(id: bigint, name: string): Promise<void>;
    updateContent(id: bigint, newContentData: MediaContent): Promise<void>;
    updateDisplayContent(id: bigint, displayContent: DisplayScreenContent): Promise<void>;
    updateTerms(id: bigint, title: string, content: string, version: string, isActive: boolean): Promise<void>;
    uploadContent(contentData: MediaContent): Promise<bigint>;
    uploadDisplayContent(displayContent: DisplayScreenContent): Promise<bigint>;
}
