MSM SECURITY GUARDS — FINAL PROFESSIONAL CLOUD/RBAC BUILD

BASE
- Latest stable 2026-08-25 index.html preserved as the application foundation.
- Existing Firebase project: msm-security-guards-database.
- Existing CNIC upsert, Employment Status, Regions/Sectors, Recycle Bin, Audit Trail, Transfer History, import/export, print and PWA behavior preserved.

NEW IN THIS BUILD
1. Shared Firestore companySettings/main document for company/about/contact/navigation information.
2. Parent/Admin Company Settings editor.
3. Dynamic post-login company strip with cloud address, phone and sector links.
4. Company information modal for all authorized users.
5. Explicit UI messaging that employee data is stored in shared Firestore, not browser memory.
6. Firestore rule for companySettings: authorized users read; Parent/Admin write; delete disabled.
7. Responsive company/sector navigation styling for desktop and mobile.

DEFAULT COMPANY INFORMATION
Source: MSM Security Guards public website/contact page.
Head office: House No. 36-E, Cricketer Colony, Near NETSOL Technologies, Airport Road, Lahore.
Phones: 0423-7169344 / 0301-1010959
Email: msmsecurity11@gmail.com
Hours: Mon-Sat 09:00 AM-06:00 PM
Regional offices: North/Islamabad, Rawalpindi, Faisalabad, Multan, South/Karachi.

DEPLOY
1. Replace repository index.html with this package's index.html.
2. Keep the existing msm-security-guards-logo.png beside index.html.
3. Publish firestore.rules in Firebase project msm-security-guards-database.
4. Keep firebase.json and firestore.indexes.json in the Firebase deployment folder.
5. Hard refresh GitHub Pages.
6. Login as Parent and open COMPANY SETTINGS. Save the company data once.
7. Test: Parent -> Regions/Sectors -> Long Roll -> CNIC Upsert -> Employment Status -> Recycle Bin.
8. Test a Sector Gmail in another browser/device and confirm the same Firestore data appears.

IMPORTANT
Do not mix this index.html with older index.html files. This is a merged build based on the latest stable application.
