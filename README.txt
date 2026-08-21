MSM SECURITY GUARDS — FINAL WEB + PWA + APK-READY PACKAGE

WEB
- index.html: existing MSM application, preserved and patched only where needed.
- Dynamic Parent sector navigation: Full Database + default Islamabad/Rawalpindi/KPK/Chakwal + Other Sectors.
- Parent can add future sectors from the Manage Sectors panel; sector names are stored in Firestore sectorCatalog.
- Normal Delete now moves the active record to Recycle Bin.
- Bulk Delete now moves selected records to Recycle Bin.
- Recycle Bin is Parent-only for viewing, recovery, permanent delete and emptying.
- Global search now includes Sector.
- Bulk transfer now updates the Sector field when the destination matches a catalog sector.
- Firebase rules enforce that active records cannot be hard-deleted without a matching Recycle Bin write in the same atomic operation.

SEO / PWA
- robots.txt + sitemap.xml
- manifest.webmanifest + installable PWA icons
- service worker for shell caching
- public SEO metadata targets MSM Longroll / MSM Security Guards / Syed Jalal Hussain Shah.

APK
- android-app/ is an Android Studio/Gradle project using Chrome Custom Tabs.
- It opens the same secure live website, so Firebase Google/Gmail login works through the normal browser engine instead of an embedded WebView.
- .github/workflows/build-apk.yml builds a debug APK on GitHub Actions.

DEPLOY WEB
Upload the web-root files to the repository root and keep android-app/ and .github/ in the repository if you want the APK workflow.

FIRESTORE
Publish firestore.rules and firestore.indexes.json in Firebase before testing Recycle Bin / sector administration.

SCALABILITY
The current application still loads the active Parent collection into the browser. A later phase should implement cursor-based Firestore pagination/search for 9,000+ records rather than claiming the current UI is server-side paginated.
