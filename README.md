# MSM SECURITY GUARDS PVT LTD — Final Region/Sector Build

## What is fixed
- Parent login shows **Regions first**. Loose top-level Islamabad/Rawalpindi/KPK/Chakwal sector buttons are removed.
- **North Region is purple/highlighted** and appears first.
- Islamabad, Rawalpindi, KPK and Chakwal are **not auto-assigned**. Parent must manually add/assign them.
- Parent can add unlimited Regions and Sectors and move/arrange sectors between Regions.
- Region cards stay open after click; sector buttons appear inside the selected Region.
- Regional Office is locked to its assigned Region and can add/arrange sectors only inside that Region.
- Regional Office can update Regional Office locations.
- Employee entry for Regional Office requires a Sector from its own Region.
- Login and logged-in branding: **MSM SECURITY GUARDS PVT LTD**.
- English + Urdu instructions are included side-by-side and mobile-friendly.
- Records area keeps the existing long-roll, search, import/export, recycle bin and 3D-style record presentation.

## Firebase
1. Deploy `index.html` with the existing logo asset `msm-security-guards-logo.png`.
2. Publish `firestore.rules` in the same Firebase project.
3. Deploy `firestore.indexes.json` if Firebase asks for indexes.
4. Regional Office access records created by Parent now store both `region` and `regionId`.

## Important
The four old sector names are intentionally not seeded into a Region. Your Parent account should manually test adding/assigning them under North Region.
