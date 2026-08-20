Dynamic Sector Update
- Existing default sectors: Islamabad, Rawalpindi, KPK, Chakwal.
- Parent can add more sector names from Manage Sectors.
- New sectors are stored in Firestore collection: sectorCatalog.
- Existing employee/database code is preserved.
- Before using Add Sector, Firestore rules must allow parent read/write on sectorCatalog.
