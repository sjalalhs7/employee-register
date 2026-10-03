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

## Update 6 - reference files
- V76 zip (AI-Syed Jalal) login + approved UI concept image: split login (brand panel left with logo stage, headline, 4 numbered feature cards; login card right), homepage hero with logo stage and quick buttons, service tiles, sidebar + top bar, mobile bottom navigation. All applied to MSM in orange / emerald-gold glass + clay, light-mode readable.
- App_Ideas_Collection_Catalog.html is an unstyled list of developer project ideas (markdown previewer, quiz, weather, kanban). Nothing in it applies to a guard database. Not copied; ideas worth considering later: kanban board for pending verifications.
- Build label now v8 (bottom centre).
- Not done: animated 3D logo, floating icon effects (removed on purpose, they caused the hang); real-phone and real-Firebase testing.

## Update 7 (build v9) - completeness, filters, fast import, print-size images
- Long Roll import: 3000 rows tested = 6 batches of 500, 3 committed in parallel (simulated 300 ms latency: 0.6 s vs 1.8 s serial). Real speed depends on internet and Firestore rules. Preview now draws the first 300 rows only (3000 rows used to freeze the page); totals stay exact.
- Conditional formatting: guards missing any of 10 key fields (name, CNIC, MSM no., father, mobile, DOB, address, client, photo, police verification) are highlighted yellow (1-3 missing) or orange (4+), with a "Missing N" badge listing the fields on hover.
- Filters: Data completeness (all / incomplete / complete / missing basic data / missing photo / missing police verification) plus existing Client, Sector, Location, Supervisor, Station, Rank, Status, dates. Search by name/CNIC/MSM no. in table, side menu and Find window.
- Image fit: photos become 600x800 (3:4) JPEG ~50 KB; verification images max 1754 px (A4 page) JPEG under ~450 KB. Stored where the form and print preview read them (photoData, policeVerifDoc). Print CSS keeps photo and verification pages unsplit.
- Limits: PDFs are not accepted in the verification upload (images only). A 1 MB Firestore document limit applies, so two large images per guard are compressed. Print preview tested by CSS only, not on a real printer.
- Not done: data-analysis dashboard (only the "N of M incomplete" counter), export Region/Sector selector, separate Data-Form page. Zero bugs cannot be guaranteed; tested on simulated data in desktop-size and phone-size Chromium only.

## Update 8 - FULL AUDIT of build v10 (3 Oct 2026)
Method: static scan (IDs, inline handlers, called functions), JS syntax (14 scripts), click-crawl of 40 navigation items (sidebar, dropdowns, cards, hero, top bar), view-switch check, light-mode contrast scan, performance profile, 3000-row import simulation, completeness filter, image-fit test. Desktop (1366 px) and phone (390 px) Chromium, simulated data.

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | Script errors / failed clicks in 40 navigation items | - | 0 found |
| 2 | Inline handlers calling undefined functions | - | 0 found |
| 3 | Navigation: Database, Form, Audit, Admin, Transfer, About screens all open | - | OK |
| 4 | Pale-mint subtitle ("Regional Distribution of Guards...") unreadable in light mode, same colour on region contact labels | Medium | FIXED |
| 5 | Superseded duplicate code (old Upload Center, old Sector bar, 2.7 KB) could be picked up by a future edit | Low | REMOVED |
| 6 | Endless animations: login 0, home 1 (was 64); blur elements 4-6 (was 54) | High (hang) | FIXED earlier, re-verified |
| 7 | Police verification stored as inline image in the record (the form itself uploads to Storage). Fine for one A4 image (<450 KB) but Firestore documents are limited to 1 MB | Medium | OPEN - keep verification under ~450 KB (auto-compressed) |
| 8 | Duplicate IDs msmNewRegionName / msmNewSectorName / msmNewSectorRegion in two templates of Sector Manager (pre-existing) | Medium | OPEN - works while only one renders; fix needs rewrite of Sector Manager |
| 9 | Two Firestore rules files differ (Firestore.rules vs firestore.rules); regional/client users may delete records; rules use email without lower-case | High (security) | OPEN - needs your decision and Firebase console access |
| 10 | Stat-star numbers flagged by contrast scanner (white on emerald/orange shape drawn by a sibling element) | Info | False positive, verified by eye |
| 11 | PDF verification cannot be uploaded through the Upload Center (images only); the Data Form still accepts PDF | Low | OPEN |
| 12 | Print preview checked by CSS rules only | Medium | OPEN - needs one real print test |

Untested: real Firebase login/data, real Excel (3000 rows), real printer, real phone, other browsers (Safari/Firefox).
Honest status: no script errors found in the tested paths; zero bugs cannot be proven.
