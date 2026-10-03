# MSM Long Roll – Full Website Audit (2 Oct 2026)

Scope: every file in `employee-register-main.zip` (68 files). Method: static scan of all references, IDs, rules and PWA files; JS syntax check (12 scripts); headless-browser run over HTTP; computed-style scan of every element for blue/violet (light + dark); visual check of login, dashboard and import preview.

## FIXED in this delivery
| # | Problem | Evidence | Fix |
|---|---------|----------|-----|
| 1 | Import blocked all 450 rows | The Excel has only a Client/Project column (clients like "113. Saudi Pak Tower"), but the code looked for a SECTOR name there. My first fix (name cleaning) was based on a wrong assumption and was not enough. | Import preview now has an **"Import into Sector"** picker. Sector is taken from the picker, else the file name ("Islamabad Sector"), else the Region's only Sector. Tested: 5/5 rows Ready in both cases |
| 2 | 341 blue/violet colour values in code | colour scan of index.html | Recoloured at source to emerald / orange / cream |
| 3 | Browser bar + PWA colours still navy | `theme-color #0c1a2a`, manifest `#071522` | Changed to emerald `#047857` / cream |
| 4 | hero image 31 % dark blue | pixel scan | Recoloured (`hero-reference.png`) |
| 5 | Logo files 1.1 MB each (identical duplicates) | file sizes | Resized to 640 px, 289 KB, same filenames |
| 6 | Import table showed empty boxes instead of ✅/❌ on the office PC | your screenshot | Replaced with text badges "✓ Ready / ✗ Blocked"; emoji/symbol font fallback added |
| 7 | CNIC formats inconsistent (row 142 had no dashes) | screenshot | Import now writes 12345-1234567-1 |
| 8 | 7 images without alt text | scan | `alt` added |
| 9 | Old cached files kept showing | `sw.js` cache name unchanged | New cache name `…orange-emerald-v3` |

## VERIFIED OK
No missing local files or 404s, no case-mismatch (GitHub is case-sensitive), JS syntax 0 errors, 0 page errors, 0 blue elements, `lang`/viewport/title present, no `eval`/`document.write`, Storage rules require login + 5 MB + image/PDF only.

## NOT FIXED – needs your decision (risks)
1. **Two Firestore rule files** (`Firestore.rules` 8 KB and `firestore.rules` 4.7 KB) differ. `firebase.json` uses the lower-case one. I could not see what is live in the Firebase console – open Firestore → Rules and compare. Delete the unused copy afterwards.
2. **Regional and Client users can delete records** (rules allow `delete` inside their scope). Intentional? If not, restrict delete to Parent.
3. **Email case**: Firestore rules look up `authorizedUsers/{email}` without `.lower()` (Storage rules do lower it). The user document IDs must be all lower-case.
4. **Firebase API key is public in the page.** Normal for Firebase, but restrict the key to your domain in Google Cloud Console.
5. **Dead/duplicate code**: `msmRenderSectorManager` is defined 4 times (last one wins); element IDs `msmNewRegionName/SectorName/SectorRegion` are duplicated in two templates. Works today, but a future edit can break Sector Manager.
6. **Clutter**: ~15 README/AUDIT files, two old full copies of the site (`MSM_SECURITY_GUARDS_PVT_LTD_STABLE_FINAL.html` 2.3 MB, `MSM_Longroll_Dashboard.html`), Android project files, `msm-shield-reference.png.png`, `msm-shield-reference` (no extension). Not used by the site; risk of editing the wrong file.
7. 59 `innerHTML` writes: not individually reviewed; user text is escaped in the places I checked (`escapeHtml`).

## NOT VERIFIED (could not test)
Real Firebase login, real data screens (tables/forms/Sector Manager), live Firestore rules, phone/APK behaviour, printing/export.

## Update 3 (Oct 2026) – Import/Export, Home forms, Navigation, CNIC uploads
- **Why upload stopped after the update (fact):** the new Region/Sector security check blocked every row because the Excel has no Sector column. Fixed with Region + Sector pickers in the import preview.
- **Add Region / Add Sector:** old code used `prompt()` pop-ups, which phones and installed apps often block. Replaced with proper forms (tested with simulated Firestore).
- **Navigation:** real dropdown menus (Regions, Database, Company), touch-friendly, closes on outside tap / Esc.
- **Police Verification Upload and Guard Photo Upload:** file names containing the guard's CNIC are matched automatically; preview first, then upload to Storage and attach to the record (5 MB limit).
- **Not done:** Export Region/Sector scope selector; a full separate Data-Form page (Data Form menu item opens the existing form); latent bug: `msmHomeAddSectorLocation` treats sectors as objects but the catalog holds strings.
- **Not tested:** real Firestore/Storage writes, real 450-row Excel, phones.

## Update 4
- Header title doubled: h1 text-shadow showed through transparent gradient text. Fixed (flat gold gradient, no 3D/blink).
- Side navigation added (drawer on phone, fixed on PC ≥1100px) with quick CNIC/name search; top dropdown nav kept.
- Glass + clay mix strengthened on cards/buttons in light and dark.
- Uploaded V76 zip and App_Ideas catalog are separate projects: not merged.
- Still not done: Export Region/Sector selector, separate Data-Form page, extra features beyond quick search. Not tested with real Firebase/Excel/phone.

## Update 5 (hang fixes, light-mode text, finder, homepage sections)
- **Hang / blockage (measured):** home page had 64 endless animations and 54 blur-effect elements; now 1 and 6. Falling petals/leaves/rain removed. Long tasks: none in test.
- **Light-mode text:** white-on-light text on the login info card fixed; header bands made deeper emerald. Automated contrast scan: login 0 issues. Stat-star numbers sit on gradient shapes the scanner cannot read; checked by eye only.
- **Logo:** sticky top bar with logo on every app screen; logo also in the side menu.
- **Find data by CNIC / Name / MSM No.:** top bar button, side menu and homepage cards. Searches loaded records, and for a full 13-digit CNIC also queries the database.
- **Homepage:** new service cards - Find by CNIC, Find by Name, Police Verification, Guard Photos, Data Form, Import/Export.
- **Shared files:** V76 zip design blueprint (logo stage, service strip, side + top nav, performance rules) applied. App_Ideas catalog is a generic idea list; nothing in it fits this database, so nothing copied from it.
- **Not done:** Export Region/Sector selector; separate full-page Data Form; two-column PC login layout; bottom nav on phone. Not tested on real Firebase, Excel or a phone.
