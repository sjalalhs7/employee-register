# MSM SECURITY GUARDS PVT LTD — Stable Regional Manager Update

## What was fixed
1. Regional Office users now load the shared sector catalog instead of an empty/default list.
2. Region/Sector dropdowns are touch-friendly and remain selectable after UI refreshes.
3. Parent can create Regions and Sectors, assign/move existing Sectors, and manage Regional Office locations.
4. Regional Office can create new Sectors inside its assigned Region, assign an existing unassigned Sector to that Region, and update Regional Office locations.
5. Regional users get a Regional Sector selector when creating/editing Long Roll records, preventing blank/unscoped records.
6. Regional users can see both modern `sector` records and legacy records where `clientproject` contains the sector name.
7. Firestore rules now allow Regional Offices to attach an unassigned sector to their own Region and to read legacy records for sectors assigned to their Region.
8. Company name remains **MSM SECURITY GUARDS PVT LTD** on the login and post-login branding.
9. Existing login, Firebase persistence, import/export, recycle bin, audit trail, print form, PWA and 3D record badge are preserved.

## Publish order
1. Replace the deployed `index.html` with `MSM_SECURITY_GUARDS_PVT_LTD_STABLE_FINAL.html` (rename it to `index.html`).
2. In Firebase Firestore Rules, replace the rules with `MSM_SECURITY_GUARDS_PVT_LTD_STABLE_FINAL_FIRESTORE_RULES.txt` and click **Publish**.
3. Keep the existing `manifest.webmanifest`, `sw.js`, `msm-security-guards-logo.png` and other project assets.
4. Hard refresh the site after deployment (Chrome: clear cached page / reload).

## Important test sequence
- Parent login → Regions / Sectors → North Region → Assign Islamabad / Rawalpindi / KPK / Chakwal.
- Parent → Add Sector → choose North Region → Add Sector.
- Parent → Admin → add Regional Office Gmail with the North Region.
- Regional Office login → Regions / Sectors → create a new sector.
- Regional Office → select an existing unassigned sector → Assign.
- Regional Office → add/update Regional Office location.
- Regional Office → New Entry → Regional Sector must be selectable before saving.
- Parent → Register → verify records remain after refresh and across browsers.

Do not delete the existing Firestore data.
