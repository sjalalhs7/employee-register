# MSM SECURITY GUARDS PVT LTD — Renewed Final Region/Sector Build

## Official company branding
- The **official company logo supplied by the user** is included as `msm-security-guards-logo.png`.
- The official company name is **MSM Security Guards (Pvt) Ltd** / **MSM SECURITY GUARDS PVT LTD**.
- Official contact strip used in the renewed web UI:
  - House No. 36-E, Cricketer Colony, Near Netsol Technologies, Airport Road, Lahore
  - Tel: 042-37169344
  - Cell: 0346-7780660
  - Email: msmsecurity11@gmail.com

## Workflow
Parent → Region → Sector → Regional Office

- Parent login shows Regions first.
- North Region is highlighted in purple.
- Islamabad, Rawalpindi, KPK and Chakwal are NOT automatically assigned.
- Parent manually creates/assigns sectors to Regions.
- Regional Office is restricted to its assigned Region.
- Regional Office can add/arrange sectors and manage locations/employees for its Region.
- Existing long-roll, import/export, recycle bin, search and audit features are preserved.
- English + Urdu instructions remain available.

## Firebase deployment
1. Upload/deploy `index.html` and the included `msm-security-guards-logo.png` together.
2. Publish `firestore.rules` in the same Firebase project.
3. Deploy `firestore.indexes.json` if prompted.
4. Keep `firebase.json` with the hosting site configuration.

## Important test
The old sector names are intentionally not seeded into North Region. Use the Parent account to manually add/assign them and verify the new Region → Sector workflow.
