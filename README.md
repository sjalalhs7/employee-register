# MSM Security Guards — Professional Final Build

This package keeps the existing Firebase/Auth/Long Roll application and adds a clean professional homepage modeled on the supplied company reference.

## Included
- index.html — production website entry point
- msm-security-guards-logo.png — corrected real PNG logo
- manifest.webmanifest — installable PWA metadata
- sw.js — basic offline shell/PWA service worker
- firestore.rules — companion Firestore rules

## Important
The homepage uses LIVE Firebase session/record/catalog data where available. It does not hard-code fake values such as 9,000+ guards.

## Region/Sector model
- regionCatalog/{regionId}: { name, sectors[] }
- sectorCatalog/{sectorId}: { name, region }
- Parent can add regions, add sectors, and move sectors.
- Employee records are not deleted when a sector is moved.

## Deployment
1. Upload all package files together to the same web root.
2. Publish firestore.rules to the SAME Firebase project used by the web app.
3. Ensure the deployed domain is in Firebase Authentication → Authorized domains.
4. Test Google login with an authorized user.
5. Test Parent → Add Region → Add Sector → Move Sector → Open Sector.
6. Test an existing client/sector login before importing new records.

## Note
The PWA is an installable web app, not a signed Google Play APK. A native APK can be produced later from this web app if required.
