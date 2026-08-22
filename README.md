# MSM Longroll Final Website

Files:
- `index.html` — merged final web application
- `msm-logo.png` — supplied MSM Security Guards logo
- `msm-login-logo.png` — same supplied logo used on login
- `firestore.rules` — updated rules for sector-scoped access and scoped Recycle Bin

Key fixes:
1. Parent dashboard is colorful/dark navy-gold, matching the supplied premium visual direction.
2. Supplied MSM logo is used throughout the login and portal.
3. Parent sector buttons are dynamic: new sector names appear as sector data/access is added.
4. Sector users can see existing legacy records by sector field OR Client/Project name, so existing Islamabad data can appear without re-importing.
5. Import Long Roll is available to authorized scoped users and automatically stamps their sector/client scope.
6. Recycle Bin is available to authorized scoped users; parent still has full access.
7. The previously misplaced Phase-1 JavaScript was moved inside the main script so the Recycle Bin and sector module actually execute.

Deployment: replace the repository `index.html`, upload both PNG logo files, and publish `firestore.rules` in Firebase Console > Firestore Database > Rules. Then hard-refresh the site.
