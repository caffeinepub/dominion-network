import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import InviteLinksModule "invite-links/invite-links-module";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Stripe "stripe/Stripe";
import StripeMixin "stripe/StripeMixin";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
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

  public type ApprovalEntity = {
    #pendingContent;
    #memberRegistration;
    #adminRequest;
    #pendingCardLoad;
    #pendingPriceUpdate;
    #pendingAffiliatePayout;
    #pendingBroadcastRequest;
    #pendingHeroJoinRequest;
    #imageLibraryItem;
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
  var nextPendingApprovalId : Nat = 0;

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
  let imageLibraryStore = Map.empty<Nat, ImageLibraryItem>();

  let pendingApprovals = Map.empty<Nat, { entity : ApprovalEntity; entityId : Nat }>();

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

  // User Profile Management
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

  // User Approval System
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

  // Invite Code Management (Admin only)
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob : Blob = "";
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

  // Wallet Management - User can only access their own wallet
  public shared ({ caller }) func createWallet(address : Text, seed : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create wallets");
    };

    let wallet : WalletInfo = {
      walletAddress = address;
      balance = 0;
      transactionHistory = [];
      recoverySeed = seed;
    };

    walletInfo.add(address, wallet);
    principalToWallet.add(caller, address);
  };

  public query ({ caller }) func getCallerWallet() : async ?WalletInfoPublic {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallets");
    };

    switch (principalToWallet.get(caller)) {
      case null { null };
      case (?address) {
        switch (walletInfo.get(address)) {
          case null { null };
          case (?wallet) {
            ?{
              walletAddress = wallet.walletAddress;
              balance = wallet.balance;
              transactionHistory = wallet.transactionHistory;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getCallerWalletWithSeed() : async ?WalletInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access wallets");
    };

    switch (principalToWallet.get(caller)) {
      case null { null };
      case (?address) { walletInfo.get(address) };
    };
  };

  public shared ({ caller }) func addTransaction(txInfo : TransactionInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    switch (principalToWallet.get(caller)) {
      case null { Runtime.trap("No wallet found for user") };
      case (?address) {
        switch (walletInfo.get(address)) {
          case null { Runtime.trap("Wallet info not found") };
          case (?wallet) {
            let updatedHistory = wallet.transactionHistory.concat([txInfo]);
            let updatedWallet = {
              walletAddress = wallet.walletAddress;
              balance = wallet.balance;
              transactionHistory = updatedHistory;
              recoverySeed = wallet.recoverySeed;
            };
            walletInfo.add(address, updatedWallet);
          };
        };
      };
    };
  };

  // Content Management - Admins can upload, manage, and update all content
  public shared ({ caller }) func uploadContent(contentData : MediaContent) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload content");
    };

    let id = nextContentId;
    nextContentId += 1;

    let newContent = {
      id = id;
      title = contentData.title;
      description = contentData.description;
      duration = contentData.duration;
      file = contentData.file;
      thumbnail = contentData.thumbnail;
      mediaType = contentData.mediaType;
      categories = contentData.categories;
      uploadedBy = caller;
      uploadTime = contentData.uploadTime;
      views = 0;
      rating = 0;
    };

    content.add(id, newContent);
    id;
  };

  public query func getContent(id : Nat) : async ?MediaContent {
    content.get(id);
  };

  public query func listContent() : async [MediaContent] {
    content.values().toArray();
  };

  public shared ({ caller }) func updateContent(id : Nat, newContentData : MediaContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };

    switch (content.get(id)) {
      case null { Runtime.trap("Content not found") };
      case (?existingContent) {
        content.add(id, newContentData);
      };
    };
  };

  public shared ({ caller }) func deleteContent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete content");
    };

    switch (content.get(id)) {
      case null { Runtime.trap("Content not found") };
      case (?c) {
        content.remove(id);
      };
    };
  };

  // Advertisement Management - Admin only
  public shared ({ caller }) func createAdvertisement(ad : Advertisement) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create advertisements");
    };

    let id = nextAdId;
    nextAdId += 1;

    let newAd = {
      id = id;
      title = ad.title;
      content = ad.content;
      imageUrl = ad.imageUrl;
      targetUrl = ad.targetUrl;
      placement = ad.placement;
      adType = ad.adType;
      active = ad.active;
      createdAt = ad.createdAt;
      views = 0;
      clicks = 0;
    };

    advertisements.add(id, newAd);
    id;
  };

  public query func getActiveAdvertisements() : async [Advertisement] {
    advertisements.values().toArray().filter(func(ad) { ad.active });
  };

  public shared ({ caller }) func updateAdvertisement(id : Nat, ad : Advertisement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update advertisements");
    };

    switch (advertisements.get(id)) {
      case null { Runtime.trap("Advertisement not found") };
      case (?_) {
        advertisements.add(id, ad);
      };
    };
  };

  public shared ({ caller }) func deleteAdvertisement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete advertisements");
    };

    advertisements.remove(id);
  };

  // Category Management - Admin only
  public shared ({ caller }) func createCategory(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    let id = nextCategoryId;
    nextCategoryId += 1;

    categories.add(id, { id = id; name = name });
    id;
  };

  public shared ({ caller }) func updateCategory(id : Nat, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    switch (categories.get(id)) {
      case null { Runtime.trap("Category not found") };
      case (?_) {
        categories.add(id, { id = id; name = name });
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    categories.remove(id);
  };

  public query func listCategories() : async [Category] {
    categories.values().toArray();
  };

  // Terms and Conditions - Admin creates/updates, anyone can read
  public shared ({ caller }) func createTerms(title : Text, content : Text, version : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create terms");
    };

    let id = nextTermsId;
    nextTermsId += 1;

    let terms : TermsAndConditions = {
      id = id;
      title = title;
      content = content;
      createdAt = 0;
      version = version;
      isActive = true;
    };

    termsAndConditions.add(id, terms);
    id;
  };

  public shared ({ caller }) func updateTerms(id : Nat, title : Text, content : Text, version : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update terms");
    };

    switch (termsAndConditions.get(id)) {
      case null { Runtime.trap("Terms not found") };
      case (?existing) {
        let updated : TermsAndConditions = {
          id = id;
          title = title;
          content = content;
          createdAt = existing.createdAt;
          version = version;
          isActive = isActive;
        };
        termsAndConditions.add(id, updated);
      };
    };
  };

  public query func getActiveTerms() : async ?TermsAndConditions {
    let allTerms = termsAndConditions.values().toArray();
    let found = allTerms.find(func(t) { t.isActive });
    found;
  };

  // Chat Room Management - Admins can create/manage, users can create, participants can access
  public shared ({ caller }) func createChatRoom(name : Text, chatType : ChatType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create chat rooms");
    };

    let id = nextChatRoomId;
    nextChatRoomId += 1;

    let room : ChatRoom = {
      id = id;
      name = name;
      participants = [caller];
      chatType = chatType;
      isActive = true;
      createdBy = caller;
      createdAt = 0;
    };

    chatRooms.add(id, room);
    id;
  };

  public shared ({ caller }) func sendMessage(roomId : Nat, content : Text, messageType : MessageType, fileBlob : ?BlobStorage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (chatRooms.get(roomId)) {
      case null { Runtime.trap("Chat room not found") };
      case (?room) {
        let isParticipant = room.participants.find(func(p : Principal) : Bool { p == caller });
        if (isParticipant == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not a participant of this chat room");
        };

        let msgId = nextMessageId;
        nextMessageId += 1;

        let message : ChatMessage = {
          id = msgId;
          roomId = roomId;
          sender = caller;
          content = content;
          messageType = messageType;
          timestamp = 0;
          fileBlob = fileBlob;
        };

        chatMessages.add(msgId, message);
        msgId;
      };
    };
  };

  public query ({ caller }) func getChatRoomMessages(roomId : Nat) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (chatRooms.get(roomId)) {
      case null { Runtime.trap("Chat room not found") };
      case (?room) {
        let isParticipant = room.participants.find(func(p : Principal) : Bool { p == caller });
        if (isParticipant == null and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not a participant of this chat room");
        };

        chatMessages.values().toArray().filter(func(msg) { msg.roomId == roomId });
      };
    };
  };

  // Pending Content Approval - Admin only
  public shared ({ caller }) func approvePendingContent(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve content");
    };

    switch (pendingContentSubmissions.get(id)) {
      case null { Runtime.trap("Pending content not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          content = pending.content;
          submittedBy = pending.submittedBy;
          submittedAt = pending.submittedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingContentSubmissions.add(id, updatedPending);

        if (approved) {
          content.add(pending.content.id, pending.content);
        };
      };
    };
  };

  public query ({ caller }) func listPendingContent() : async [PendingContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending content");
    };
    pendingContentSubmissions.values().toArray();
  };

  // Member Registration Approval - Admin only
  public shared ({ caller }) func approveMemberRegistration(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve member registrations");
    };

    switch (pendingMemberRegistrations.get(id)) {
      case null { Runtime.trap("Pending member registration not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          principal = pending.principal;
          name = pending.name;
          email = pending.email;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingMemberRegistrations.add(id, updatedPending);

        if (approved) {
          AccessControl.assignRole(accessControlState, caller, pending.principal, #user);
        };
      };
    };
  };

  public query ({ caller }) func listPendingMemberRegistrations() : async [PendingMemberRegistration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending member registrations");
    };
    pendingMemberRegistrations.values().toArray();
  };

  // Admin Request Approval - Admin only
  public shared ({ caller }) func approveAdminRequest(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve admin requests");
    };

    switch (pendingAdminRequests.get(id)) {
      case null { Runtime.trap("Pending admin request not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          principal = pending.principal;
          name = pending.name;
          email = pending.email;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingAdminRequests.add(id, updatedPending);

        if (approved) {
          AccessControl.assignRole(accessControlState, caller, pending.principal, #admin);
        };
      };
    };
  };

  public query ({ caller }) func listPendingAdminRequests() : async [PendingAdminRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending admin requests");
    };
    pendingAdminRequests.values().toArray();
  };

  // Card Load Approval - Admin only
  public shared ({ caller }) func approveCardLoad(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve card loads");
    };

    switch (pendingCardLoads.get(id)) {
      case null { Runtime.trap("Pending card load not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          userId = pending.userId;
          amount = pending.amount;
          method = pending.method;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingCardLoads.add(id, updatedPending);
      };
    };
  };

  public query ({ caller }) func listPendingCardLoads() : async [PendingCardLoad] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending card loads");
    };
    pendingCardLoads.values().toArray();
  };

  // Price Update Approval - Admin only
  public shared ({ caller }) func approvePriceUpdate(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve price updates");
    };

    switch (pendingPriceUpdates.get(id)) {
      case null { Runtime.trap("Pending price update not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          itemId = pending.itemId;
          itemType = pending.itemType;
          oldPrice = pending.oldPrice;
          newPrice = pending.newPrice;
          requestedBy = pending.requestedBy;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingPriceUpdates.add(id, updatedPending);
      };
    };
  };

  public query ({ caller }) func listPendingPriceUpdates() : async [PendingPriceUpdate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending price updates");
    };
    pendingPriceUpdates.values().toArray();
  };

  // Affiliate Payout Approval - Admin only
  public shared ({ caller }) func approveAffiliatePayout(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve affiliate payouts");
    };

    switch (pendingAffiliatePayouts.get(id)) {
      case null { Runtime.trap("Pending affiliate payout not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          userId = pending.userId;
          amount = pending.amount;
          commissionDetails = pending.commissionDetails;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingAffiliatePayouts.add(id, updatedPending);
      };
    };
  };

  public query ({ caller }) func listPendingAffiliatePayouts() : async [PendingAffiliatePayout] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending affiliate payouts");
    };
    pendingAffiliatePayouts.values().toArray();
  };

  // Broadcast Request Approval - Admin only
  public shared ({ caller }) func approveBroadcastRequest(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve broadcast requests");
    };

    switch (pendingBroadcastRequests.get(id)) {
      case null { Runtime.trap("Pending broadcast request not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          userId = pending.userId;
          title = pending.title;
          description = pending.description;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingBroadcastRequests.add(id, updatedPending);
      };
    };
  };

  public query ({ caller }) func listPendingBroadcastRequests() : async [PendingBroadcastRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending broadcast requests");
    };
    pendingBroadcastRequests.values().toArray();
  };

  // Hero Join Request Approval - Admin only
  public shared ({ caller }) func approveHeroJoinRequest(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve hero join requests");
    };

    switch (pendingHeroJoinRequests.get(id)) {
      case null { Runtime.trap("Pending hero join request not found") };
      case (?pending) {
        let updatedPending = {
          id = pending.id;
          roomId = pending.roomId;
          requestedBy = pending.requestedBy;
          requestedAt = pending.requestedAt;
          status = if (approved) { #approved } else { #rejected };
        };
        pendingHeroJoinRequests.add(id, updatedPending);
      };
    };
  };

  public query ({ caller }) func listPendingHeroJoinRequests() : async [PendingHeroJoinRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending hero join requests");
    };
    pendingHeroJoinRequests.values().toArray();
  };

  // Image Library Approval - Admin only
  public shared ({ caller }) func approveImageLibraryItem(id : Nat, approved : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve image library items");
    };

    switch (imageLibraryStore.get(id)) {
      case null { Runtime.trap("Image library item not found") };
      case (?item) {
        let updatedItem = {
          id = item.id;
          title = item.title;
          description = item.description;
          image = item.image;
          uploadTime = item.uploadTime;
          status = if (approved) { #approved } else { #rejected };
        };
        imageLibraryStore.add(id, updatedItem);
      };
    };
  };

  public query ({ caller }) func listImageLibraryItems() : async [ImageLibraryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view image library items");
    };
    imageLibraryStore.values().toArray();
  };

  // Display Screen Content - Admin only
  public shared ({ caller }) func uploadDisplayContent(displayContent : DisplayScreenContent) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload display content");
    };

    let id = nextDisplayContentId;
    nextDisplayContentId += 1;

    let newContent = {
      id = id;
      title = displayContent.title;
      description = displayContent.description;
      file = displayContent.file;
      contentType = displayContent.contentType;
      uploadedBy = caller;
      uploadTime = 0;
      isActive = true;
    };

    displayScreenContent.add(id, newContent);
    id;
  };

  public shared ({ caller }) func updateDisplayContent(id : Nat, displayContent : DisplayScreenContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update display content");
    };

    switch (displayScreenContent.get(id)) {
      case null { Runtime.trap("Display content not found") };
      case (?_) {
        displayScreenContent.add(id, displayContent);
      };
    };
  };

  public shared ({ caller }) func deleteDisplayContent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete display content");
    };

    displayScreenContent.remove(id);
  };

  public query func getActiveDisplayContent() : async [DisplayScreenContent] {
    displayScreenContent.values().toArray().filter(func(c) { c.isActive });
  };

  // Affiliate Tier Management - Admin only
  public shared ({ caller }) func createAffiliateTier(tier : AffiliateTier) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create affiliate tiers");
    };

    let id = nextAffiliateTierId;
    nextAffiliateTierId += 1;

    let newTier = {
      id = id;
      name = tier.name;
      commissionRate = tier.commissionRate;
      minReferrals = tier.minReferrals;
    };

    affiliateTiers.add(id, newTier);
    id;
  };

  public shared ({ caller }) func updateAffiliateTier(id : Nat, tier : AffiliateTier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update affiliate tiers");
    };

    switch (affiliateTiers.get(id)) {
      case null { Runtime.trap("Affiliate tier not found") };
      case (?_) {
        affiliateTiers.add(id, tier);
      };
    };
  };

  public shared ({ caller }) func deleteAffiliateTier(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete affiliate tiers");
    };

    affiliateTiers.remove(id);
  };

  public query func listAffiliateTiers() : async [AffiliateTier] {
    affiliateTiers.values().toArray();
  };
};
