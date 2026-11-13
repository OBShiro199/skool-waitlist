# Lander Library tests (buildsoftwaresolo.com/landers)

Spec: LanderLibrary-BUILD.md, adapted: lives at /landers inside this site, 6 landers (Perihelion, Proofbox,
Saltmarsh, Foldwell, Paperwing, Smallport), every hero a full-bleed video background with the text over it.

| # | Check | Result (13 Nov 2026, local production build) |
|---|---|---|
| 1 | /landers/<slug> without a session shows the password screen | Pass |
| 2 | A wrong password shows an error; the right one opens the library | Pass |
| 3 | The password is not in the browser bundle (`grep -r <password> .next/static` finds nothing) | Pass |
| 4 | The library shows 6 cards, each with a playing preview | Pass |
| 5 | Search filters by name and style | Pass |
| 6 | Every lander opens; no two share a headline font | Pass (6 different) |
| 7 | Every hero autoplays muted, loops, and is under 8 MB (MP4 0.5–1.7 MB, WebM fallback 0.3–1.2 MB) | Pass |
| 8 | With reduced motion, heroes show the poster and a Play button | Pass |
| 9 | The clone panel has the rebuild, still and motion prompts with Copy, plus MP4, poster and 5 companion downloads | Pass |
| 10 | No real brand, logo or person in pages or videos | Pass (copy reviewed) |
| 11 | Every lander at 390px wide has no sideways scroll | Pass |
| 12 | Every hero is full-bleed video with the headline inside it | Pass |
| 13 | `npm run build` passes | Pass |
| 14 | Locked Vault tabs open a "Join on Skool" panel | Pass |

Live checks after deploy: set LANDERS_PASSWORD in Vercel, then repeat 1, 2, 4 and 7 on the real site.
