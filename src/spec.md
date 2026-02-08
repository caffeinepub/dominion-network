# Specification

## Summary
**Goal:** Fix admin access control and admin navigation issues, resolve UI overlap/clipping, eliminate build/deploy failures, and ensure required 5D-style background assets load correctly with readable contrast.

**Planned changes:**
- Fix admin authorization so all `/admin/*` routes are accessible to authenticated admin-role users and blocked for non-admin users, using a stable backend admin-check consumed by the frontend.
- Audit and correct the Admin menu/dropdown links so each item routes to an existing `/admin/*` page and loads correctly for admins (remove/rename any misleading or duplicate items).
- Address overlapping/clipping layout problems in navigation, dropdowns, mobile menu, and admin pages (wrapping/truncation, viewport-safe dropdown behavior, overflow/z-index fixes).
- Resolve build/runtime/deployment errors across frontend and backend so builds compile cleanly and the app runs without immediate console/runtime exceptions in core flows.
- Ensure the required route-based background switching remains correct and that the specified 5D background images exist as static assets and render with sufficient foreground contrast.
- Apply consistent typography/spacing/component styling across shared UI surfaces while keeping the existing dark futuristic/theater theme.

**User-visible outcome:** Admin users can access and navigate all admin pages without access-denied errors; non-admin users remain blocked from admin routes; the UI no longer overlaps/clips on common screen sizes; builds/deployments succeed reliably; and each major area shows the correct futuristic background with readable text.
