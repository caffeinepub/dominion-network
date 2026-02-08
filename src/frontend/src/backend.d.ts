import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export type Time = bigint;
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface PaymentCancelResponse {
    message: string;
    sessionId: string;
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
export interface UserProfile {
    name: string;
    role: Role;
    isOnline: boolean;
    walletAddress: string;
    email: string;
    creditCardNumber: string;
    viewingHistory: Array<bigint>;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
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
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    paymentCancel(sessionId: string): Promise<PaymentCancelResponse>;
    paymentSuccess(sessionId: string, accountId: string, caffeineCustomerId: string): Promise<PaymentSuccessResponse>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
