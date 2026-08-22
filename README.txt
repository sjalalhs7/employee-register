MSM LONGROLL DATABASE — FINAL UI/SECTOR UPDATE

Files:
1. index-final.html -> upload/replace repository index.html
2. msm-security-guards-logo.png -> upload beside index.html
3. firestore.rules -> publish in Firebase Console > Firestore Database > Rules

Included updates:
- Supplied MSM Security Guards logo used across login and main website.
- Parent home page receives a subtle centered logo watermark.
- Login remains colorful/premium and uses the supplied logo.
- Parent homepage has REGION / SECTOR cards; sector names from the catalog appear automatically.
- Parent can add future sectors from Manage Sectors; they appear on the homepage.
- Sector users see their authorized sector and can open it from the homepage.
- Sector users can see legacy/imported records where Client/Project is the sector name, even if sector field was not present.
- Sector users get Import Long Roll (.xlsx) and their imports are automatically stamped with their authorized Client/Project and Sector when missing.
- Sector users get a scoped Recycle Bin with recover/permanent-delete controls limited by Firestore rules.
- Parent behavior, Instructions, Audit Trail, Export, Print, and existing long-roll features are preserved.

Important deployment order:
A) Replace index.html with index-final.html content.
B) Upload msm-security-guards-logo.png to the same GitHub Pages folder.
C) Publish firestore.rules in Firebase Console.
D) Hard refresh the website / clear GitHub Pages cache.
E) Test Parent login -> Islamabad sector -> 427 records.
F) Test Islamabad sector Gmail -> same records visible.
G) Test sector Import and scoped Recycle Bin.
