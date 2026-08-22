MSM LONGROLL — FINAL MERGED UPDATE

BASE:
The existing dynamic-sector/recycle-bin index.html was preserved.
The supplied MSM login design (logo + watermark + Google/Gmail + Email/Password + reset) was merged into that base.

IMPORTANT:
There must be ONE active index.html in the GitHub repository root.
Do NOT upload a second index.html.

UPLOAD:
1. Replace GitHub's current index.html with this package's index.html.
2. Keep your existing Firebase config, manifest, service worker, images and other working files.
3. In Firebase Console -> Firestore Database -> Rules, replace the current rules with firestore.rules from this package and Publish.
4. Hard-refresh the website after GitHub Pages deploys.

PRESERVED / MERGED:
- Supplied login visual design and watermark
- Google/Gmail authentication
- Email/password authentication and password reset
- Existing enrollment/long-roll form
- Search/filter/sort/import/export/printing/audit
- Parent and client access
- FULL DATABASE
- Islamabad / Rawalpindi / KPK / Chakwal sector sections
- Dynamic sector catalog for future sectors
- Recycle Bin: Delete -> Recycle Bin -> Recover / Permanent Delete / Empty
- Parent bulk transfer and transfer history
- Instructions page updated for the sector/recycle workflow

SECURITY:
The supplied rules make active-record deletion Parent-only through the application's recycle-bin flow, keep sector catalog Parent-only, keep recycle-bin Parent-only, and make audit logs append-only.

TEST ORDER:
Parent login -> sector buttons -> Add Sector -> add one dummy guard -> delete -> Recycle Bin -> recover -> transfer two dummy guards -> client login isolation -> audit.
Do not permanently delete real records during testing.
