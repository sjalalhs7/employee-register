MSM SECURITY GUARDS — FINAL PROFESSIONAL CLOUD + RBAC 2026

FINAL PACKAGE CONTENTS
- index.html — professional web application
- msm-security-guards-logo.png — official MSM logo
- icon-192.png / icon-512.png / icon-512-maskable.png — valid PWA icons
- manifest.webmanifest — portable PWA manifest (GitHub Pages + Firebase Hosting)
- sw.js — PWA service worker
- firestore.rules — Firestore RBAC rules
- firestore.indexes.json — required Firestore indexes
- firebase.json — Firestore + Firebase Hosting configuration
- android/ — Android WebView project pointing to the live web application

FINAL FIXES IN THIS BUILD
1. CNIC upsert works within the security scope for Parent/Admin and Sector/Client users.
2. Legacy records without cnicKey are still discoverable within the authorized scope.
3. Blank import fields do not overwrite existing values.
4. A blank Employment Status during import does NOT change Left Job/Removed back to Active.
5. New records default Employment Status to Active.
6. Parent/Admin global CNIC matching is preserved.
7. Sector/Client CNIC queries now include their authorized client/sector scope, avoiding permission-denied global queries.
8. Required composite indexes for scoped CNIC upsert are included.
9. Company Settings are shared in Firestore at companySettings/main.
10. Company name, address, phones and sector links render dynamically after login.
11. Official MSM logo is included in the package.
12. PWA icons are included so service-worker installation does not fail on missing files.
13. PWA start_url/scope are portable for both GitHub Pages and Firebase Hosting.
14. Firebase Hosting configuration is included.
15. Android project is included.

DEPLOY ORDER
A) Firebase Console → Firestore → Rules: publish firestore.rules.
B) Firebase Console → Firestore → Indexes: deploy firestore.indexes.json (or run firebase deploy).
C) Firebase Hosting: deploy the package root with firebase.json, or continue using GitHub Pages.
D) GitHub Pages: upload the web files to the repository root if that remains your live host.
E) Do NOT mix files from older packages into this build.

LIVE TEST ORDER
Login → Parent Dashboard → Company Settings → Regions → Sectors → Long Roll → CNIC Upsert → Employment Status → Recycle Bin → Sector Login → Mobile/PWA.

VALIDATION
- JavaScript syntax: PASS
- JSON validation: PASS
- Firebase configuration present: PASS
- Firestore RBAC sections present: PASS
- CNIC scoped upsert logic: PASS
- Employment Status preservation logic: PASS
- PWA icon files present: PASS
- Firebase Hosting configuration present: PASS

NOTE
A real production Google/Firebase transaction must still be tested from the live browser/account. This package does not claim a live transaction test was performed inside the build environment.
