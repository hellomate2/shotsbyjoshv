#!/usr/bin/env bash
#
# One-shot setup for the env vars Josh needs in Vercel production.
# Prompts for each value with a hidden password-style input, so the values
# never get displayed on-screen or leaked to shell history.
#
# Usage:   bash scripts/configure-secrets.sh
#
set -e

# Navigate to repo root no matter where the script is run from.
cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null 2>&1; then
  echo "✗ vercel CLI is not installed. Run:  npm i -g vercel@latest" >&2
  exit 1
fi

echo
echo "──────────────────────────────────────────────────────────"
echo "  ShotsByJoshV — Vercel env var setup"
echo "──────────────────────────────────────────────────────────"
echo
echo "You'll be asked for each value below. Your input is HIDDEN"
echo "as you type. Press Enter to skip a value you don't have yet."
echo

prompt_secret() {
  local var_name="$1" var_label="$2" var_hint="$3"
  local value=""
  echo "  ▸ ${var_label}"
  [ -n "${var_hint}" ] && echo "    ${var_hint}"
  read -s -p "    > " value
  echo
  echo
  if [ -z "${value}" ]; then
    echo "    (skipped)"
    echo
    return 1
  fi
  # Delete existing (if any) so we can re-create cleanly.
  vercel env rm "${var_name}" production --yes >/dev/null 2>&1 || true
  # Pipe the value into `vercel env add`. Will be marked sensitive.
  printf "%s\n" "${value}" | vercel env add "${var_name}" production --sensitive >/dev/null
  echo "    ✓ Saved ${var_name} (sensitive)"
  echo
  return 0
}

CHANGED=0

if prompt_secret "SQUARE_LOCATION_ID" \
    "Square Location ID" \
    "From Square Developer Dashboard → Locations tab. Starts with 'L'."; then
  CHANGED=1
fi

if prompt_secret "SQUARE_ACCESS_TOKEN" \
    "Square Access Token (only if you want to update it)" \
    "From Square Dev Dashboard → Credentials → Production. Starts with 'EAAA'. Leave blank to keep current."; then
  CHANGED=1
fi

if prompt_secret "RESEND_API_KEY" \
    "Resend API key (for booking emails to Josh)" \
    "From resend.com → API Keys. Starts with 're_'. Leave blank to skip emails for now."; then
  CHANGED=1
fi

if prompt_secret "DATAFORSEO_LOGIN" \
    "DataForSEO login (optional, for rank tracking)" \
    "Your account email. Leave blank to skip."; then
  CHANGED=1
fi

if prompt_secret "DATAFORSEO_PASSWORD" \
    "DataForSEO API password (optional)" \
    "From DataForSEO → API Access. Leave blank to skip."; then
  CHANGED=1
fi

if prompt_secret "CRON_SECRET" \
    "Cron secret (any random string)" \
    "Generate one with:  openssl rand -hex 32  (run in another terminal). Leave blank to skip."; then
  CHANGED=1
fi

echo "──────────────────────────────────────────────────────────"
if [ "${CHANGED}" -eq 1 ]; then
  echo "  Redeploying to production with the new env vars..."
  echo "──────────────────────────────────────────────────────────"
  echo
  vercel --prod --yes
  echo
  echo "✓ Done. Test the booking flow at https://shotsbyjoshv.com"
else
  echo "  No values entered — nothing to do."
  echo "──────────────────────────────────────────────────────────"
fi
