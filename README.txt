MSM SECURITY GUARDS — CURRENT INDEX + SECURE FIRESTORE PACKAGE

Use this package as the continuation of the existing project.

Files:
- index.html — current MSM application version preserved.
- msm-login-logo.png — existing MSM login/logo asset.
- msm-logo.png — existing MSM company logo asset.
- firestore.rules — reviewed Parent / Client / Sector / Recycle Bin / Audit / Transfer rules.
- firestore.indexes.json — Firestore index configuration.
- firebase.json — Firebase CLI configuration.

Current architecture:
- Parent sees FULL DATABASE plus individual sector sections.
- Default sectors: Islamabad, Rawalpindi, KPK, Chakwal.
- Parent can add future sectors from Manage Sectors; names are stored in sectorCatalog.
- Recycle Bin is Parent-only for viewing/recovery/permanent deletion.
- Normal record deletion is wired to Recycle Bin in the current index version.
- Bulk deletion is wired to Recycle Bin in the current index version.
- Client users remain restricted to their assigned clientproject and optional sector.
- Existing employee enrollment, import/export, audit, transfer and print functionality is preserved.

IMPORTANT:
1. Publish firestore.rules in Firebase before testing Add Sector or Recycle Bin.
2. Do not delete existing Firestore records.
3. Do not replace the current index with an older generated version.
4. True cursor-based pagination for 9,000+ records is still a later scalability phase.
