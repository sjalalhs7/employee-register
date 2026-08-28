# MSM Long Roll — FINAL Production Package

## Firebase project
`msm-security-guards-database`

## What is final in this package
- Login + Firebase Authentication flow
- Parent / Regional / Client RBAC
- Explicit Region → Sector → Client/Project assignment on every Long Roll record
- Enrollment form retained as a required part of the application
- Employee photo upload and Police Verification certificate upload
- Firebase Storage paths tied to the employee record ID
- Parent Region/Sector management
- Regional Office Sector/Location management inside assigned Region
- Scoped Long Roll queries that match Firestore Security Rules
- Scoped Recycle Bin queries
- Audit trail
- PWA cache version bumped to force the new application shell

## Do NOT upload the old package over this one
Deploy the contents of this `FINAL_WEB` folder as the website root.

## Firebase Rules
Publish BOTH:
1. `firestore.rules` in Firestore → Rules
2. `storage.rules` in Storage → Rules

Also deploy `firestore.indexes.json` if using Firebase CLI.

## CLI
```bash
firebase use msm-security-guards-database
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## GitHub Pages
Upload the contents of `FINAL_WEB` to the repository root that serves:
`https://sjalalhs7.github.io/employee-register/`

After publishing:
1. Sign out.
2. Clear the site's service-worker/cache if an old screen remains.
3. Sign in again.
4. Test Parent → Add Region → Add Sector → Region click → Sector click → New Entry → Save Long Roll.

## First Parent
The Firestore document must exist as:
`authorizedUsers/{lowercase-email}`
with:
`role: "parent"`

## Production test order
Parent:
- Login
- Add Region
- Add Sector
- Assign/Move Sector
- Add Regional Office location
- Create employee with Region + Sector + Client/Project
- Upload photo
- Upload police certificate
- Edit
- Recycle
- Recover

Regional:
- Login
- See only assigned Region
- Add Sector only inside assigned Region
- Add Location
- Create/edit only records in assigned Region

Client:
- Login
- See only assigned Client/Project + Sector
- Create/edit only its own scope

Security:
- Try another Region as Regional
- Try another Client as Client
- Try another employee file URL
- Confirm all unauthorized actions fail
