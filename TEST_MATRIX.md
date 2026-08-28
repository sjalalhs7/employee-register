# Final Acceptance Test Matrix

| Test | Parent | Regional | Client |
|---|---:|---:|---:|
| Login | PASS | PASS | PASS |
| View all records | PASS | NO | NO |
| View assigned region | PASS | PASS | NO |
| View assigned client/sector | PASS | PASS | PASS |
| Add Region | PASS | NO | NO |
| Add Sector | PASS | PASS (own Region) | NO |
| Move Sector | PASS | own Region only | NO |
| Add Regional Location | PASS | own Region | NO |
| Create Long Roll | PASS | own Region | own Client/Sector |
| Edit Long Roll | PASS | own Region | own Client/Sector |
| Upload employee photo | PASS | PASS | PASS |
| Upload police certificate | PASS | PASS | PASS |
| Recycle record | PASS | scoped | scoped |
| Permanent delete | Parent-controlled | restricted by UI | restricted by UI |
| Audit trail | PASS | scoped get | own get |
| Unauthorized Region access | DENY | DENY | DENY |
| Unauthorized Client access | DENY | DENY | DENY |

**Release rule:** do not call the deployment production-ready until these tests are performed against the actual Firebase project.
