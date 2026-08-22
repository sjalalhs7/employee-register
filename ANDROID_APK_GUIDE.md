# MSM Longroll — Android APK path

## Recommended path: PWA -> Trusted Web Activity (TWA)

The website is PWA-ready. The fastest way to make an Android APK without rewriting the whole system is to package the live PWA as a Trusted Web Activity.

1. Deploy these files to the same GitHub Pages folder:
   - index.html
   - msm-security-guards-logo.png
   - manifest.webmanifest
   - sw.js
   - icon-192.png
   - icon-512.png
   - icon-512-maskable.png
2. Confirm the live URL works:
   https://sjalalhs7.github.io/employee-register/
3. Use PWABuilder or Bubblewrap to package the PWA for Android.
4. Keep the same Firebase project and authorizedUsers collection. The APK is only the app shell; Firestore/Auth remain the backend.
5. For a production TWA with no browser address bar, configure Digital Asset Links for the final signing certificate.

## Bubblewrap command-line route

npm install -g @bubblewrap/cli
bubblewrap init --manifest https://sjalalhs7.github.io/employee-register/manifest.webmanifest
bubblewrap build

Bubblewrap generates a signed APK and an Android App Bundle after the Android build tools and signing key are configured.

## Important Firebase note

The current web app uses Firebase Web Authentication. For the TWA route, Google login runs in the user's Chrome/Android browser context instead of a restricted embedded WebView, which is the safer compatibility choice for this existing web login.

If a fully native Android app is desired later, use native Firebase Authentication with Google Credential Manager and native Firestore access. That is a separate Android implementation, not just an APK wrapper.
