# Specification

## Summary
**Goal:** Complete and fix the Admin area so admins can reliably navigate to all required admin rooms and use them without crashes, while non-admins are consistently blocked.

**Planned changes:**
- Restore a complete Admin navigation experience for authenticated admins via (1) the Header Admin dropdown and (2) the /admin/rooms hub page, ensuring all links match registered routes and work on desktop/mobile.
- Make admin access flow consistent across all /admin/* routes: protect routes, allow admins through, and route non-admin/logged-out users to the existing AdminAccessDenied screen without crashes or infinite loading.
- Rebuild and/or verify all required admin rooms and panels are present, routable, and stable with safe loading/empty/error states; ensure primary actions work end-to-end where backend support exists (otherwise show clear non-crashing “capability unavailable” messaging).
- Prevent regressions by ensuring no new runtime errors are introduced in core non-admin routes and existing navigation/auth flows continue to work without requiring hard refresh.

**User-visible outcome:** Admin users can access every required admin page from the header dropdown and /admin/rooms, use supported actions (e.g., ads CRUD/toggle, invite links generation/accept flow, approvals/editing flows, uploads/image library, pricing/terms, member directory, display screen, mall admin) with stable UI states, while non-admin users are blocked with the existing access denied screen and the rest of the app remains unaffected.
