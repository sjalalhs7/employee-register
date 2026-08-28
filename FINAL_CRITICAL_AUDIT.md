# MSM Long Roll — Critical Professional Audit

## Major issues found in the uploaded project

### 1. Photo upload was mapped incorrectly
The original `readForm()` stored `f_photo` (the Yes/No Office Use field) as `photo`, while the actual uploaded image lived in `uploadState.photoData`.
The original upload routine therefore could upload the wrong value instead of the employee image.

**Fixed:** the final layer uses `photoUrl` and uploads the actual `uploadState.photoData`.

### 2. Police verification certificate had the same mapping problem
The status field `f_policeverif` and the uploaded document `uploadState.policeVerifDoc` were treated as the same field.

**Fixed:** status remains `policeverif`; the actual document is stored as `policeVerificationUrl`.

### 3. Region/Sector were not authoritative employee fields
The previous parent save path did not reliably stamp `region`, `regionId`, and `sector` on parent-created records.

**Fixed:** every new Long Roll record requires Region + Sector and stores both `region` and `regionId`.

### 4. Client queries did not fully match the security rules
A sector-scoped Client could query all records for a client project, while the Firestore rule allowed only the assigned sector/blank legacy records. Firebase evaluates queries against their potential result set; Rules are not filters.

**Fixed:** Client queries use the same `clientproject` + `sector` constraints as the rules.

### 5. Regional record loading was patched multiple times
The uploaded `index.html` contained multiple overlapping Regional/sector stability patches. That made the final behavior difficult to reason about and increased the chance of one patch overriding another.

**Fixed:** a final authoritative layer is applied last and the package is documented as the production source.

### 6. Default sectors were silently seeded
The previous loader could automatically create default sectors and a hard-coded North location.

**Fixed:** sectors are no longer silently created. Parent/Regional users deliberately create and assign them.

### 7. Storage scope was too narrow
The original Storage rule allowed access only to the Firebase Auth UID that uploaded the file. That prevents another authorized Parent/Regional user from accessing a record's employee documents.

**Fixed:** employee files are stored under `enrollment/{recordId}/...` and Storage Rules check the corresponding Firestore record scope.

### 8. Deployment binding was incomplete
The uploaded package referenced Firebase deployment instructions but did not contain `.firebaserc`.

**Fixed:** `.firebaserc` is included and points to `msm-security-guards-database`.

### 9. PWA/service-worker cache could preserve an older interface
The previous cache key was `msm-longroll-v3`.

**Fixed:** cache version is now `msm-longroll-v5-final`.

## Important distinction
The company public website and the Long Roll application remain separate.

## Not changed
- Company logo assets remain separate from the login/company header artwork.
- Enrollment remains part of the application.
- Long Roll remains the actual database/register.
- Existing Firestore data is not intentionally deleted by this package.

### 10. Regional authorization is resilient to regionId-only records
The final loader prefers `regionId` and falls back to the normalized region name, matching the RBAC model used by the authorization document.

### 11. Logo separation is now explicit
The wide company-name/contact artwork (`msm-security-guards-logo.png`) is reserved for the login branding, while the authenticated Long Roll home uses the separate shield/company emblem (`msm-logo.png`).
