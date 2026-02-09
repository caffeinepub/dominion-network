import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Stripe "stripe/Stripe";
import StripeMixin "stripe/StripeMixin";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";

actor {
  include MixinStorage();

  public type Role = {
    #admin;
    #subscriber;
    #member;
  };

  public type Category = {
    id : Nat;
    name : Text;
  };

  public type MediaType = {
    #video;
    #audio;
    #image;
  };

  public type MediaContent = {
    id : Nat;
    title : Text;
    description : Text;
    duration : Nat;
    file : BlobStorage.ExternalBlob;
    thumbnail : BlobStorage.ExternalBlob;
    mediaType : MediaType;
    categories : [Nat];
    uploadedBy : Principal;
    uploadTime : Int;
    views : Nat;
    rating : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Role;
    walletAddress : Text;
    creditCardNumber : Text;
    viewingHistory : [Nat];
    isOnline : Bool;
  };

  public type AdPlacement = {
    #homepage;
    #category;
    #mall;
  };

  public type AdType = {
    #banner;
    #sidebar;
  };

  public type Advertisement = {
    id : Nat;
    title : Text;
    content : Text;
    imageUrl : Text;
    targetUrl : Text;
    placement : AdPlacement;
    adType : AdType;
    active : Bool;
    createdAt : Int;
    views : Nat;
    clicks : Nat;
  };

  public type AffiliateTier = {
    id : Nat;
    name : Text;
    commissionRate : Nat;
    minReferrals : Nat;
  };

  public type ReferralLink = {
    id : Nat;
    userId : Principal;
    code : Text;
    createdAt : Int;
    views : Nat;
    clicks : Nat;
    conversions : Nat;
  };

  public type DisplayContentType = {
    #movie;
    #music;
    #advertisement;
  };

  public type DisplayScreenContent = {
    id : Nat;
    title : Text;
    description : Text;
    file : BlobStorage.ExternalBlob;
    contentType : DisplayContentType;
    uploadedBy : Principal;
    uploadTime : Int;
    isActive : Bool;
  };

  public type ApprovalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type PendingContent = {
    id : Nat;
    content : MediaContent;
    submittedBy : Principal;
    submittedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingMemberRegistration = {
    id : Nat;
    principal : Principal;
    name : Text;
    email : Text;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingAdminRequest = {
    id : Nat;
    principal : Principal;
    name : Text;
    email : Text;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingCardLoad = {
    id : Nat;
    userId : Principal;
    amount : Nat;
    method : Text;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingPriceUpdate = {
    id : Nat;
    itemId : Nat;
    itemType : Text;
    oldPrice : Nat;
    newPrice : Nat;
    requestedBy : Principal;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingAffiliatePayout = {
    id : Nat;
    userId : Principal;
    amount : Nat;
    commissionDetails : Text;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type WalletInfo = {
    walletAddress : Text;
    balance : Nat;
    transactionHistory : [TransactionInfo];
    recoverySeed : Text;
  };

  public type WalletInfoPublic = {
    walletAddress : Text;
    balance : Nat;
    transactionHistory : [TransactionInfo];
  };

  public type TransactionInfo = {
    transactionId : Text;
    amount : Nat;
    recipientAddress : Text;
    timestamp : Int;
    transactionType : {
      #incoming;
      #outgoing;
      #walletLoad;
      #purchase;
      #affiliatePayout;
    };
  };

  public type BitcoinTransaction = {
    transactionId : Text;
    blockId : Text;
    amount : Nat;
    timestamp : Int;
    senderAddress : Text;
    recipientAddress : Text;
    transactionType : {
      #incoming;
      #outgoing;
      #walletLoad;
      #purchase;
      #affiliatePayout;
    };
  };

  public type TermsAndConditions = {
    id : Nat;
    title : Text;
    content : Text;
    createdAt : Int;
    version : Text;
    isActive : Bool;
  };

  public type ChatType = {
    #direct;
    #group;
    #broadcast;
  };

  public type ChatRoom = {
    id : Nat;
    name : Text;
    participants : [Principal];
    chatType : ChatType;
    isActive : Bool;
    createdBy : Principal;
    createdAt : Int;
  };

  public type MessageType = {
    #text;
    #image;
    #video;
    #audio;
    #file;
  };

  public type ChatMessage = {
    id : Nat;
    roomId : Nat;
    sender : Principal;
    content : Text;
    messageType : MessageType;
    timestamp : Int;
    fileBlob : ?BlobStorage.ExternalBlob;
  };

  public type CallType = {
    #audio;
    #video;
    #groupAudio;
    #groupVideo;
  };

  public type CallSession = {
    id : Nat;
    roomId : ?Nat;
    initiator : Principal;
    participants : [Principal];
    callType : CallType;
    isActive : Bool;
    startedAt : Int;
    endedAt : ?Int;
  };

  public type ConnectionRequest = {
    id : Nat;
    requester : Principal;
    recipient : Principal;
    connectionCode : Text;
    status : {
      #pending;
      #approved;
      #rejected;
    };
    requestedAt : Int;
  };

  public type PlaybackRoom = {
    id : Nat;
    contentId : Nat;
    participants : [Principal];
    isActive : Bool;
    startedBy : Principal;
    startedAt : Int;
    currentPosition : Nat;
  };

  public type LiveBroadcast = {
    id : Nat;
    host : Principal;
    title : Text;
    description : Text;
    isActive : Bool;
    startedAt : Int;
    endedAt : ?Int;
    requiresApproval : Bool;
  };

  public type PendingBroadcastRequest = {
    id : Nat;
    userId : Principal;
    title : Text;
    description : Text;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type PendingHeroJoinRequest = {
    id : Nat;
    roomId : Nat;
    requestedBy : Principal;
    requestedAt : Int;
    status : ApprovalStatus;
  };

  public type MagicLinkInvitation = {
    id : Nat;
    email : Text;
    token : Text;
    createdAt : Int;
    expiresAt : Int;
    used : Bool;
  };

  public type ImageLibraryItem = {
    id : Nat;
    title : Text;
    description : Text;
    image : BlobStorage.ExternalBlob;
    uploadTime : Int;
    status : ApprovalStatus;
  };

  var nextContentId : Nat = 0;
  var nextCategoryId : Nat = 0;
  var nextAdId : Nat = 0;
  var nextAffiliateTierId : Nat = 0;
  var nextReferralLinkId : Nat = 0;
  var nextDisplayContentId : Nat = 0;
  var nextPendingContentId : Nat = 0;
  var nextPendingMemberId : Nat = 0;
  var nextPendingAdminId : Nat = 0;
  var nextPendingCardLoadId : Nat = 0;
  var nextPendingPriceUpdateId : Nat = 0;
  var nextPendingPayoutId : Nat = 0;
  var nextTermsId : Nat = 0;
  var nextChatRoomId : Nat = 0;
  var nextMessageId : Nat = 0;
  var nextCallSessionId : Nat = 0;
  var nextConnectionRequestId : Nat = 0;
  var nextPlaybackRoomId : Nat = 0;
  var nextBroadcastId : Nat = 0;
  var nextPendingBroadcastId : Nat = 0;
  var nextPendingHeroJoinId : Nat = 0;
  var nextMagicLinkId : Nat = 0;
  var nextImageLibraryId : Nat = 0;

  let content = Map.empty<Nat, MediaContent>();
  let categories = Map.empty<Nat, Category>();
  let userViewingHistory = Map.empty<Principal, [Nat]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let advertisements = Map.empty<Nat, Advertisement>();
  let affiliateTiers = Map.empty<Nat, AffiliateTier>();
  let referralLinks = Map.empty<Nat, ReferralLink>();
  let userReferralLinks = Map.empty<Principal, Nat>();
  let displayScreenContent = Map.empty<Nat, DisplayScreenContent>();
  let termsAndConditions = Map.empty<Nat, TermsAndConditions>();

  let pendingContentSubmissions = Map.empty<Nat, PendingContent>();
  let pendingMemberRegistrations = Map.empty<Nat, PendingMemberRegistration>();
  let pendingAdminRequests = Map.empty<Nat, PendingAdminRequest>();
  let pendingCardLoads = Map.empty<Nat, PendingCardLoad>();
  let pendingPriceUpdates = Map.empty<Nat, PendingPriceUpdate>();
  let pendingAffiliatePayouts = Map.empty<Nat, PendingAffiliatePayout>();
  let pendingBroadcastRequests = Map.empty<Nat, PendingBroadcastRequest>();
  let pendingHeroJoinRequests = Map.empty<Nat, PendingHeroJoinRequest>();
  var imageLibraryStore = Map.empty<Nat, ImageLibraryItem>();

  let bitcoinTransactionHistory = Map.empty<Text, [BitcoinTransaction]>();
  let walletInfo = Map.empty<Text, WalletInfo>();
  let transactionHistory = Map.empty<Text, [TransactionInfo]>();
  let principalToWallet = Map.empty<Principal, Text>();

  let chatRooms = Map.empty<Nat, ChatRoom>();
  let chatMessages = Map.empty<Nat, ChatMessage>();
  let callSessions = Map.empty<Nat, CallSession>();
  let userConnectionCodes = Map.empty<Principal, Text>();
  let connectionRequests = Map.empty<Nat, ConnectionRequest>();
  let userConnections = Map.empty<Principal, [Principal]>();
  let playbackRooms = Map.empty<Nat, PlaybackRoom>();
  let liveBroadcasts = Map.empty<Nat, LiveBroadcast>();
  let magicLinkInvitations = Map.empty<Nat, MagicLinkInvitation>();

  let inviteLinksState = InviteLinksModule.initState();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userApprovalState = UserApproval.initState(accessControlState);

  let stripe = Stripe.init(accessControlState, "usd");
  include StripeMixin(stripe);

  var initialized = false;

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Approval & Invitation Logic - Admin only (no extra approval checks, just admin status)
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(userApprovalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(userApprovalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(userApprovalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(userApprovalState);
  };

  // Invite links and RSVP integration - Admin only for generation and viewing
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob : Blob = ""; // explicit blob instead of generateUniqueCode
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteLinksState, code);
    code;
  };

  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteLinksState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteLinksState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteLinksState);
  };
};
