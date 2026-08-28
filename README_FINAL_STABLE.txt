MSM SECURITY GUARDS PVT LTD — FINAL STABLE BUILD

This package is a controlled finalization of the stable Long Roll implementation. It keeps the existing Firebase project and Firestore collections, restores a single logical Region → Sector → Long Roll assignment path, and adds explicit Storage rules for employee photos/police documents.

FILES
1. index.html — upload/replace the GitHub Pages index.html
2. firestore.rules — publish in Firebase Console > Firestore Database > Rules
3. storage.rules — publish in Firebase Storage > Rules
4. manifest.webmanifest — PWA manifest
5. sw.js — PWA service worker

DO NOT DELETE FROM FIREBASE
- authorizedUsers
- records
- recycleBin
- regionCatalog
- sectorCatalog
- auditLogs
- transferHistory
- companySettings
- Firebase Authentication users

DEPLOYMENT
A) Make a backup/copy of the currently deployed index.html.
B) Replace repository index.html with this package's index.html.
C) Upload manifest.webmanifest and sw.js beside index.html.
D) Publish firestore.rules.
E) Publish storage.rules.
F) Hard refresh Chrome / clear site cache.

FINAL TEST ORDER
1. Parent Google login.
2. Unauthorized Gmail is rejected.
3. Parent can create Region.
4. Parent can add Sector and assign/move it between Regions.
5. Regional account sees only its assigned Region/Sectors.
6. Parent creates New Entry with Client/Project + Region + Sector + Deployment Location.
7. Employee photo: choose/camera → preview/adjust → Save.
8. Police Verification: JPG/PNG/PDF → Save.
9. Confirm record appears under the selected Region/Sector.
10. Confirm edit/update stays inside the same permitted scope.
11. Test Recycle Bin and Audit Trail.
12. Test Import/Export.
13. Test Print Enrollment Form.
14. Test PWA Install App on Android Chrome.
15. Test mobile layout at 360px/390px widths.

IMPORTANT
The package can be statically checked here, but a real Firebase production test still requires opening the deployed site with the live Firebase project and performing the above login/data tests. Do not describe production as verified until those live tests pass.
