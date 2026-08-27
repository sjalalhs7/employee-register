# MSM Final Deployment — Firestore Rules + Website

## IMPORTANT
There are two separate deployments:

1. Website files (GitHub Pages or Firebase Hosting)
2. Firestore Security Rules (Firebase Console or Firebase CLI)

Uploading `index.html` to GitHub Pages does NOT publish Firestore Rules.

## Option A — Firebase Console (phone-friendly)

1. Open Firebase Console and select:
   `msm-security-guards-database`
2. Open **Build → Firestore Database → Rules**.
3. Make sure this is **Cloud Firestore Rules**, NOT Realtime Database Rules and NOT Storage Rules.
4. Replace the editor contents with the contents of `firestore.rules` from this package.
5. Wait for the editor to finish checking the rules.
6. If Firebase shows a red syntax/validation message, do not press Publish; copy/screenshot that exact message.
7. When validation is clean, press **Publish**.
8. After publishing, refresh the website and test:
   Google Login → Parent → Add Region → Add Sector → Open Region → Move Sector.

## Option B — Firebase CLI (best way to bypass a broken Console Publish button)

From the folder containing `firebase.json`:

```bash
firebase login
firebase use msm-security-guards-database
firebase deploy --only firestore:rules
```

For the website + rules together:

```bash
firebase deploy
```

## Project match
The website currently uses Firebase project:
`msm-security-guards-database`

The `.firebaserc` file is already set to that project.

## Critical authorized user setup
The first Parent user must already exist in:

`authorizedUsers/{lowercase-email}`

with at least:

`role: "parent"`

Example:

```text
authorizedUsers
  └── your-email@gmail.com
       role: parent
```

## Do NOT use insecure test rules in production
Do not replace the rules with:

```text
allow read, write: if true;
```

That would expose the employee database.
