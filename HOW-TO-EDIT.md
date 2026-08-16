# How to make edits to shotsbyjoshv.com

A guide for Dev (and Josh) on making changes without breaking anything.

## The easy way (recommended)
Open this project folder in **Claude Code** and just say what you want:
- "Swap the hero photo for this new one" (drag the photo in)
- "Change the price of the Gold prom package to $300"
- "Update the terms to say X"

Then say "deploy it" — Claude runs `vercel deploy --prod` and it's live in ~1 minute.

## Common edits by hand

### Swap or add photos
Photos live in `public/photos/` sorted by category (`cars`, `events`, `outdoor`,
`sports`, `about`). To swap one, replace the file and **keep the same filename**
(e.g. overwrite `cars/01.jpg` with the new shot). To add new ones, drop them in
numbered like `07.jpg` and update the gallery list in `lib/constants.ts`.

### Change text, prices, packages, terms
Almost every word on the site lives in one file: `lib/constants.ts`.
Search for the text you want to change, edit it, save.

### Change links (Instagram etc.)
Also in `lib/constants.ts` — e.g. `INSTAGRAM_URL`.

## Publishing changes
```bash
cd ~/Projects/shotsbyjoshv-site
npm install        # first time on a new computer only
npm run build      # check nothing broke
vercel deploy --prod --yes
```
(Needs `vercel login` once per computer — Dev's Vercel account.)

## Turning on card payments (once Josh sends Square credentials)
See CLAUDE.md → "Card payments (Square)". Short version: put Josh's production
Square Access Token + Location ID into Vercel env vars, set
`NEXT_PUBLIC_CARD_PAYMENTS=true`, redeploy. The checkout code is already built.
