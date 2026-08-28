MSM LONGROLL DATABASE — FINAL STABLE V2.1
========================================

Purpose
-------
Production-oriented MSM Security Guards Pvt Ltd Long Roll / Employee Enrollment UI.

V2.1 changes
-------------
1. Header navigation uses shield-only MSM logo.
2. Date/time area now displays the full official company identity logo (company name + address + phone + Gmail) in a wide, readable frame.
3. Region/Sector click handling hardened for desktop and touch/mobile.
4. Parent can open all Regions and Sectors.
5. Regional Office can open only its assigned Region and assigned Sectors.
6. Client/Sector users can open only their authorized sector.
7. Dashboard hero now has a local, stable cinematic Pakistan/security visual asset.
8. North/South/East/West/Full Database cards use local visual assets so they do not depend on hotlinked images.
9. Added Quick Access controls and lower dashboard widgets.
10. Enrollment/Long Roll form remains directly below the dashboard.
11. Existing Firebase Storage upload logic and scoped record subscriptions retained.

Files
-----
index.html
msm-logo.png                         = shield-only logo
msm-security-guards-logo.png         = full company identity logo
hero-salute.svg                      = stable local hero background
region-north.svg                     = North visual
region-south.svg                     = South visual
region-east.svg                      = East visual
region-west.svg                      = West visual
region-database.svg                  = Full Database visual
firestore.rules
storage.rules
manifest.webmanifest
sw.js
icon-192.png
icon-512.png
icon-512-maskable.png

Deployment
----------
1. Replace website files with the contents of this ZIP.
2. Publish firestore.rules in Firebase Firestore Rules.
3. Publish storage.rules in Firebase Storage Rules.
4. Do NOT delete existing Firestore records.
5. Test login, region click, sector click, add sector, assignment, enrollment, photo upload,
   police verification upload, save, register, print, import/export, recycle and PWA install.

Important
---------
The code has been syntax-checked. Live Firebase authentication/storage/database testing must be
performed against the company's actual deployed Firebase account after deployment.
