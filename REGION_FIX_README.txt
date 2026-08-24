MSM SECURITY GUARDS - REGION/SECTOR FIX

This package is based on the latest CNIC + Employment Status website version.

Fixes:
1. Parent/Admin role is accepted as parent/admin (case-insensitive in website UI).
2. Region catalog loading no longer depends on orderBy('name').
3. Add Region/Add Sector now show a clear Firebase permission message.
4. Firestore rules allow Parent/Admin role variants for regionCatalog and sectorCatalog.
5. Firebase config remains msm-security-guards-database.

DEPLOY:
- Upload the contents of this web package to GitHub repository root.
- Publish firestore.rules and firestore.indexes.json to the original
  msm-security-guards-database Firebase project.
- Do NOT delete existing records.

If Add Region still says permission-denied after publishing rules, the logged-in
Gmail's authorizedUsers document does not have role parent/admin in the original
Firebase project. Fix that document rather than changing the website again.
