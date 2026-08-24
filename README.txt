MSM SECURITY GUARDS — FINAL UPDATED PACKAGE

Production Firebase project:
msm-security-guards-database

Latest UI/features preserved, including the corrected top login header.

NEW DATABASE FEATURES
1. CNIC-based upsert for Long Roll imports:
   - CNIC is normalized into cnicKey.
   - Existing guard with the same CNIC is updated.
   - New CNIC creates a new record.
   - Empty imported cells do not overwrite existing values.
   - Duplicate CNIC rows inside an import file are merged before writing.
   - Manual new-record save also checks cnicKey to prevent duplicates.
2. Employment Status:
   - Active
   - Left Job
   - Removed
   - Available in the entry form, central register, sector views, search/filter,
     dashboard counts and Excel export.
   - Historical records remain in Firestore; status changes do not delete them.

FIREBASE FILES
- firebase.json
- firestore.rules
- firestore.indexes.json

ANDROID
- android/ is an Android Studio WebView wrapper for the published GitHub Pages site.
- It opens: https://sjalalhs7.github.io/employee-register/
- This is source/build-ready project structure. A signed APK is not included because
  Android SDK/build tools are not available in this environment.

IMPORTANT
Do not delete or replace the production Firebase project. Test the updated import
and Employment Status features before any production rule changes.
