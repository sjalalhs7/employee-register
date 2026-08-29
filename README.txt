MSM LONGROLL DATABASE — FINAL UPLOAD SETUP

UPLOAD / DEPLOY FILES
=====================
1. index.html
   Upload this as the main application file to the same place where your current Longroll website is hosted.
   If you use GitHub Pages, replace the existing index.html with this one and commit/push.

2. firestore.rules
   Do NOT upload this to the website hosting folder.
   Open Firebase Console -> correct project -> Firestore Database -> Rules.
   Replace the old rules with this file and click Publish.

FINAL CANONICAL DATABASE MODEL
==============================
authorizedUsers/{lowercase-email}
  role: parent | admin | regional | client
  regionId: permanent region id for regional users
  clientproject: assigned client/project for client users
  sectorId: optional permanent sector id
  sector: optional legacy display value

regionCatalog/{regionId}
  regionId: same as document ID
  name: display name
  locations: []

sectorCatalog/{sectorId}
  name: display name
  regionId: permanent parent region ID
  region: optional display name

records/{recordId}
  regionId: permanent region ID
  sectorId: permanent sector ID where available
  sector: display name
  clientproject: client/project

IMPORTANT: FINAL CLICK FLOW
===========================
Click Region
  -> read permanent regionId
  -> query sectorCatalog where regionId == selectedRegionId
  -> render live sectors
  -> click sector
  -> filter/load matching employee records

DO NOT use display names as security identifiers.
Do not create North / north / North Region / north-region as different database identities.

FIRST DEPLOY CHECKLIST
======================
[ ] Confirm the Firebase project currently connected inside index.html is the real production project.
[ ] Confirm every authorizedUsers document ID is the user's lowercase email.
[ ] Parent/Admin account has role parent or admin.
[ ] Regional account has a valid regionId matching regionCatalog document ID.
[ ] Every sector has regionId.
[ ] New employee records include regionId.
[ ] Publish firestore.rules.
[ ] Hard refresh the website after replacing index.html.
[ ] Test Parent -> Region -> Sector -> Record.
[ ] Test Regional user only sees its own region.
[ ] Test Client user only sees assigned client/sector.

DO NOT DELETE OLD DATA OR OLD FILES UNTIL THESE TESTS PASS.
Take a backup first.

IMPORTANT HONEST NOTE
=====================
This package fixes the structural mismatch between region display names and permanent regionId values.
Existing old records that have no regionId must be updated before a Regional user can access them under the final secure rules.
Parent/Admin access is not affected by that migration.
