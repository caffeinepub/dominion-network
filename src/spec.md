# Specification

## Summary
**Goal:** Restore the full admin flow by reliably detecting admin users, showing complete admin navigation/rooms for admins, and removing any visible app version label from the UI.

**Planned changes:**
- Remove all visible version label/badge rendering across the app (including removing `VersionBadge` from `AdminRoomsPage` and eliminating any other on-screen uses of `APP_VERSION` / `VersionBadge`).
- Implement/restore the backend canister method `isCallerAdmin` so the frontend hook `useIsCallerAdmin()` can accurately determine admin status for the logged-in Internet Identity principal.
- Ensure the Header shows the Admin navigation for authenticated admins (desktop and mobile), with items sourced from `getAdminNavSections()` / `ADMIN_NAV_ITEMS`, and hides it for non-admins.
- Make `/admin/rooms` a functional admin hub that lists navigable room cards/links sourced from `ADMIN_NAV_ITEMS` (excluding `/admin/rooms`), routing to existing admin pages guarded by `AdminRouteGuard`.

**User-visible outcome:** Admin users can log in with Internet Identity and reliably access the full Admin menu (desktop and mobile) and a working Admin Rooms hub with links for editing, approvals, uploads, and related admin pages; no page displays an app version label.
