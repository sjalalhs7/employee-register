MSM LONGROLL — PROFESSIONAL FIXED SETUP

1. WEBSITE
   Upload the contents of this folder to the same GitHub Pages repository/folder currently serving the Longroll application.
   Do not merge this application with the separate public company website.

2. FIRESTORE
   Publish firestore.rules to the Firebase project:
   msm-security-guards-database

3. INDEXES
   Deploy firestore.indexes.json. If using Firebase CLI:
   firebase use msm-security-guards-database
   firebase deploy --only firestore:rules,firestore:indexes

4. STORAGE
   Publish storage.rules:
   firebase deploy --only storage

5. TEST BEFORE DELETING ANYTHING
   Parent/Admin:
   - Add Region
   - Open Region
   - Add Sector
   - Save record
   - Move record to Recycle Bin

   Regional:
   - Login with authorizedUsers doc containing role=regional and regionId
   - See only assigned region
   - Query records by regionId
   - Add a sector inside assigned region
   - Save a record with assigned regionId

   Client:
   - Login with role=client, clientproject and optional sectorId
   - See only allowed client/sector records
   - Cannot read another client or sector

6. DATA
   Do NOT delete existing records before the above tests pass.

7. NOTE ABOUT THE 3D RENDER PROMPT
   The architectural/Blender prompt is not a website code requirement and cannot create or repair the web application by itself. The Long Roll Enrollment Form remains the lower section of the dashboard. A separate image-generation/rendering workflow is required for a 3D architectural image.
