# Specification

## Summary
**Goal:** Restore the v44-style Admin menu and ensure admins can reliably navigate to all existing `/admin/*` pages and perform edit/upload/approve/reject actions across admin approval workflows without errors.

**Planned changes:**
- Restore the Header Admin entry point for authenticated admins, with working links to all existing admin routes under `/admin/*` (including approvals, editing, media upload, image library, ads, affiliate, content, display, mall, wallet management, price control, members, invite links, pricing & terms, and chat administration).
- Ensure the Admin navigation is fully usable on mobile (same destinations as desktop, no overflow/clipping, and mobile menu closes after navigation).
- Fix/complete admin moderation capabilities in approval-oriented admin rooms so each pending item type shown has functioning approve/reject (and upload/create/edit where applicable), with clear UI feedback and list refreshes.
- Address regressions since v44 so admin navigation and core admin actions do not throw runtime exceptions and the app builds cleanly (frontend TypeScript and backend Motoko).

**User-visible outcome:** Admin users see an Admin menu (desktop and mobile) that navigates to all admin pages, and can upload/create/edit and approve/reject pending items across admin approval rooms with clear success/failure feedback and no uncaught errors; non-admin users do not see the menu and cannot access `/admin/*` pages.
