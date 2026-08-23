MSM LONGROLL — FINAL DEPLOYMENT PACKAGE
=======================================
Firebase project: msm-security-guards-data-2131b

WEB
---
1. Upload this whole folder to the Firebase project/Cloud Shell.
2. Run:
   firebase use msm-security-guards-data-2131b
   firebase deploy --only hosting,firestore
3. Open the Hosting URL shown by Firebase.

IMPORTANT
---------
- index.html is the final entry page.
- Firebase Web App config is already set to msm-security-guards-data-2131b.
- Firestore rules are included as firestore.rules.
- manifest.webmanifest and icons are included for PWA installation.
- Do NOT paste the Firebase API key into email/messages or change it manually.
- Firestore Security Rules + Authentication protect the database.

FIRST LOGIN
-----------
After deployment, sign in with the Google account that will be Parent/Admin.
In Firestore, create authorizedUsers/{lowercase-email} with:
  role: "parent"

THEN
----
Parent can add Regions/Sectors and authorized client users from Admin Access.
The old 427 records are intentionally NOT restored. They can be entered manually later.

ANDROID / APK
-------------
The PWA is installable from the deployed HTTPS website using the INSTALL APP option.
For a native APK, use the supplied Android project and point it to the final HTTPS Hosting URL.
A signed APK requires Android SDK/Gradle and a signing key; it is not claimed as compiled in this package.
