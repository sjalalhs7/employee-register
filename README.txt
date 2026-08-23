MSM LONGROLL DATABASE — FINAL PACKAGE

WEB
- web/index.html = latest index-final.html renamed for GitHub Pages
- web/manifest.webmanifest = PWA install support
- web/sw.js = offline/app-shell support
- web/icon-*.png = generated from supplied MSM logo
- web/msm-security-guards-logo.png = supplied company logo
- web/firestore.rules = deployed rules source
- web/firebase.json = Firebase CLI config
- web/firestore.indexes.json = empty baseline index file

IMPORTANT FIREBASE CONFIG
The latest HTML currently contains the older Firebase web config for project
"msm-security-guards-database", while the Firestore project you most recently
initialized is "msm-security-guards-data-2131b". Do NOT invent or guess the new
apiKey/appId. Before final production login/data testing, replace the firebaseConfig
object in web/index.html with the exact Web App config from the new Firebase project.

APP
- android/ is an Android Studio WebView wrapper for the published GitHub Pages site.
- It is APK-ready source, but this environment does not contain the Android SDK/Gradle
  build toolchain, so a signed .apk cannot honestly be claimed as compiled here.
- Open android/ in Android Studio and Build > Generate App Bundle/APKs > Generate APK.

CURRENT UI ALREADY PRESENT IN LATEST FILE
- supplied logo on login/home
- centered company watermark
- red/blue premium styling
- upper navigation menu
- Home/About/Services/Contact/Login/Install App
- Regions and Sectors manager
- North/South/East/West default regions
- unlimited practical sector creation/assignment
- Quick Access
- sector Import Long Roll
- scoped Recycle Bin
- dynamic 3D diamond Records counter
- PWA install prompt

DATA
The old 427 guard records were intentionally not recovered. They can be entered
manually into sectors later, as requested.
