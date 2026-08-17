# Handing shotsbyjoshv.com over to Josh — full ownership transfer

Goal: Josh owns every account the site depends on, pays its (tiny) bills, and
Dev can walk away cleanly. Everything below is free except the domain renewal
(~$12–20/yr at GoDaddy).

## What Dev currently owns
| Thing | Where | What it does |
|---|---|---|
| Code | github.com/hellomate2/shotsbyjoshv | The source of truth |
| Hosting | Vercel — `dev-lakhanis-projects/shotsbyjoshv` | Runs the site, holds env vars, Blob storage |
| Domain | GoDaddy (Dev's account) | shotsbyjoshv.com registration + DNS |
| Booking emails | Resend (API key in Vercel env) | Emails Josh each booking |
| Payments | Square | Already Josh's own account ✓ |

## Step 1 — Josh creates three free accounts (~10 min)
1. **GitHub** — github.com (any username)
2. **Vercel** — vercel.com → "Sign up" → **choose "Continue with GitHub"** using
   his new GitHub account (this makes everything else smoother)
3. **GoDaddy** — godaddy.com (he'll need a payment card on file for future
   domain renewals)

Josh sends Dev: his GitHub username, the email he used for Vercel, and the
email he used for GoDaddy.

## Step 2 — Dev transfers each piece (~15 min, done from any computer)
1. **GitHub repo**: repo → Settings → scroll to Danger Zone → "Transfer
   ownership" → enter Josh's username. Josh accepts the email invite.
2. **Vercel project**: Vercel dashboard → shotsbyjoshv project → Settings →
   General → "Transfer Project" → enter Josh's Vercel account. Env vars,
   domains config, and Blob storage move with it. (If the transfer option
   isn't available on Hobby: fallback is Josh imports the GitHub repo in his
   own Vercel, Dev copies the env var VALUES over — see .env.example for the
   list — then the domain is moved in step 3.)
3. **Domain**: GoDaddy → My Products → shotsbyjoshv.com → "Move to another
   GoDaddy account" → enter Josh's GoDaddy email. Free, DNS settings ride
   along, nothing goes down. Josh accepts the transfer email.
4. **Resend** (booking emails): Josh signs up free at resend.com → API Keys →
   create key → in his Vercel project: Settings → Environment Variables →
   replace `RESEND_API_KEY` → redeploy. (Until he does, the old key keeps
   working; this step just gets Dev's account out of the loop.)
5. After everything: Josh connects the GitHub repo to the Vercel project
   (Vercel → project → Settings → Git) so edits auto-deploy on push.

## Step 3 — Card payments (can happen any time)
Josh, in Square Dashboard → Developer → Credentials (Production):
copy the **Access Token** and **Location ID**, then in Vercel:
- replace `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID`
- add `NEXT_PUBLIC_CARD_PAYMENTS` = `true`
- redeploy
The Card option in the booking flow switches on automatically.

## What ongoing ownership looks like for Josh
- **Costs**: domain renewal ~$12–20/yr. Vercel Hobby, GitHub, Resend free tier,
  Square: all $0 (Square takes its % per card payment only).
- **Editing**: see HOW-TO-EDIT.md. Easiest path: open the repo folder in
  Claude Code and describe the change.
- **If something breaks**: Vercel dashboard → project → "Instant Rollback"
  reverts to the previous deployment in one click.
