# Specification

## Summary
**Goal:** Fix key admin workflows (invite redemption/login, approvals, editing, uploads) and improve UI responsiveness and theme consistency without changing routes or app structure.

**Planned changes:**
- Make the `/invite/accept?token=...` flow work end-to-end: prompt Internet Identity login when logged out, redeem the same token after login, handle invalid/missing/used tokens with clear errors, and ensure redeemed users can access protected admin routes.
- Align backend and frontend expectations for admin invite redemption (e.g., callable `redeemAdminInvite`) and ensure the invite generation UI produces a correct, copyable URL including the token query parameter.
- Implement real Approve/Reject (and where applicable Delete/Bulk) actions across all approval types shown in the Admin Approval UI, with loading/disabled states, error messaging, and React Query invalidation/refetch after mutations.
- Add admin edit flows for existing admin-managed entities already present in the UI (e.g., content, ads, and other existing CRUD screens), including backend admin-only update methods where missing and safe UI save/cancel behavior.
- Update backend authorization so authenticated admins can perform uploads/creates in all admin upload rooms that currently block admins, while keeping admin route guards and non-admin restrictions intact.
- Fix responsive layout issues across pages (no overlap/off-screen content), including scrollable tab lists/tables where appropriate, safe wrapping of long identifiers, and image/hero scaling.
- Apply a consistent, readable visual theme across the app (dark-background readability improvements) without changing navigation, routes, or information architecture.

**User-visible outcome:** Admins can redeem invite links and access admin pages reliably, perform real approval decisions, edit existing admin-managed items, upload successfully in all admin upload areas, and use the app comfortably across mobile/tablet/desktop with a more consistent, readable dark theme.
