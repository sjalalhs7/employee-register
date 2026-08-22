MSM LONGROLL — REGION / SECTOR FINAL UPDATE

MANDATORY UI REQUIREMENTS IMPLEMENTED
1. Sector catalog is dynamic and is not limited to four sectors. More than 100 sectors can be added.
2. Parent Home now has a top navigation menu similar to a professional website: Home, Regions/Sectors, Full Database, Instructions, Admin Access, Audit Trail and Recycle Bin.
3. Sector users get the same top navigation structure, with My Sector instead of Parent Full Database.
4. Regions are large first-level cards. Default regions: North Region, South Region, East Region, West Region.
5. Sectors are nested inside Regions. Click a Region to open its sector buttons.
6. Parent can add unlimited Regions and unlimited Sectors without editing HTML again.
7. Parent can assign/move a Sector between Regions from the Region/Sector Manager.
8. Existing default sectors (Islamabad, Rawalpindi, KPK, Chakwal) are initially grouped under North Region on first setup. This can be changed later.
9. Existing employee records are not deleted when a sector is moved between regions.
10. Sector users can read the region/sector catalog and see their authorized region/sector navigation.
11. Firestore rules now allow authenticated users to read regionCatalog/sectorCatalog, while only Parent can create/update/delete those navigation records.

UPLOAD
A. GitHub Pages: replace the live repository index.html with this package's index.html.
B. Upload msm-security-guards-logo.png in the same folder as index.html.
C. Firebase Console > Firestore Database > Rules: replace/publish firestore.rules.
D. Do NOT upload both index.html and index-final.html as live entry pages. index-final.html is an identical reference copy.

FIRST TEST
1. Parent Google login.
2. Open Parent Home.
3. Click Regions / Sectors.
4. Click North Region and verify Islamabad, Rawalpindi, KPK and Chakwal are shown.
5. Click Islamabad Sector and verify the Islamabad records.
6. Add a test sector from Region/Sector Manager and assign it to South Region.
7. Add a test region if required, then move the test sector to another region.
8. Verify Instructions, Admin Access, Audit Trail and Recycle Bin remain available.
9. Login with a sector Gmail and verify only its authorized sector records are visible.
10. Verify the sector account sees Regions/Sectors and My Sector, but not Parent Admin Access.

SECURITY NOTE
Navigation/catalog data is not employee data. Parent has management rights. Sector users can read the navigation catalog but remain restricted by the existing record-scope rules for employee data.
