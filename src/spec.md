# Specification

## Summary
**Goal:** Ensure all requested admin “rooms” are present, reachable via routes, and visible in the Admin menu, with a single landing page to access them.

**Planned changes:**
- Audit requested admin room pages against existing admin routes and Admin navigation items; add any missing routes and corresponding Admin menu entries without breaking current routes.
- Add an admin-guarded `/admin/rooms` landing page that lists all admin rooms (derived from `frontend/src/constants/adminNav.ts`) as responsive cards/links (label + icon + route).
- Document the mapping of each requested room name to its route in code and/or the PR description.

**User-visible outcome:** Admins can see and navigate to every requested admin room from the Admin menu, and can also access a `/admin/rooms` page that lists links to all admin rooms in a responsive layout.
