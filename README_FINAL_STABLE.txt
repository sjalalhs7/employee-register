MSM LONGROLL DATABASE — FINAL STABLE PACKAGE
Version: 2026-08-28

UPLOAD PACKAGE
1. Upload ALL files in this folder to the same GitHub Pages directory:
   - index.html
   - msm-logo.png
   - msm-security-guards-logo.png
   - manifest.webmanifest
   - sw.js
   - icon-192.png
   - icon-512.png
   - icon-512-maskable.png
2. In Firebase Firestore Rules, replace the existing rules with firestore.rules and Publish.
3. In Firebase Storage Rules, replace the existing rules with storage.rules and Publish.
4. Keep the Firebase project used by this package: msm-security-guards-database.

IMPORTANT DESIGN SEPARATION
- Login/public page uses the full company logo containing company name, address and phone/email details.
- Authenticated dashboard navigation uses ONLY the official shield logo.
- The central dashboard may display the full company logo separately.

CORE WORKFLOW
Login → Authorization → Dashboard → Region → Sector → Enrollment → Save to Long Roll → Register → Print/Export.
Parent: full access; Regional Office: assigned Region; Client/Sector: assigned Client/Project + Sector.

STABILITY FIXES INCLUDED
- Region/Sector cards have explicit button hit areas, touch-action and z-index.
- Parent can create Regions and Sectors.
- Regional Office can create Sectors inside its assigned Region and add locations.
- Sector catalog queries are scoped for Regional Office Firestore rules.
- Client/Sector record queries are scoped to the assigned sector so Firestore can prove authorization.
- Employee photo and police-verification files are uploaded to Firebase Storage instead of being stored as large Firestore base64 fields.
- PDF certificate upload is supported.
- Long Roll assignment requires Client/Project + Region + Sector for Parent.
- Regional Office assignment is forced to its authorized Region/Sectors.
- Enrollment section remains part of the main authenticated page.
- PWA Install button remains available.
- Contact/About/Services are bilingual and Contact includes official company phone/email details.

REGION VISUALS
Region cards use photographic Pakistan landmarks from Wikimedia Commons via stable file redirects, with gradient fallback styling if an image cannot load. See the website source for the visual URLs and licensing pages.

DO NOT DELETE FIREBASE DATA.
Only replace the website files and publish the supplied rules. Do not delete the Firestore collections or existing records.
