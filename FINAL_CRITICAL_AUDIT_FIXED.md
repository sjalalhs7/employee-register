# MSM Longroll Professional Fixed Audit

## Confirmed mistakes found in the uploaded setup
1. The package mixed permanent IDs with legacy Region/Sector names.
2. The latest Regional patch wrote sectors without `regionId` and then queried records by sector name, conflicting with the published RBAC model.
3. Regional record loading queried `region` instead of permanent `regionId`.
4. Sector-scoped Client loading used broad queries that Firestore Rules can reject because Rules are not filters.
5. Recycle Bin regional loading queried Region name instead of `regionId`.
6. The upload routine uploaded `data.photo` and `data.policeverif` instead of the actual `uploadState` files.
7. The audit document claimed `.firebaserc` existed, but it was missing.
8. Default/demo Regions and Sectors could still appear even when Firestore was empty.
9. The old final patch and the rules were inconsistent with each other.
10. The previous package contained multiple overlapping Region/Sector patches.

## Fix applied
- Final stability layer uses permanent `regionId` and `sectorId`.
- Region click -> selected regionId -> Firestore sector query -> live sector selector.
- Regional record and Recycle Bin queries use `regionId`.
- Client queries include `clientproject` plus assigned `sectorId` or legacy sector name.
- Save flow stamps `regionId`, `region`, `sectorId`, and `sector`.
- Actual employee photo is stored as `photoUrl`.
- Actual police document is stored as `policeVerificationUrl`.
- No default Regions/Sectors are injected by the final loader.
- `.firebaserc`, Firestore indexes, Storage rules, and service-worker cache version are corrected.

## Important
This fixes the software structure, but production deployment still requires testing with real Parent, Regional, and Client accounts in the Firebase project before deleting any old version or data.
