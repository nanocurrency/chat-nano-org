# Agent instructions — chat-nano-org (chat.nano.org)

Static landing page that redirects visitors into the Nano **Discord** via a
captcha-gated invite. Live at **chat.nano.org** on **Cloudflare Pages**.

Task tracking is **beads** — run `bd prime` first.

## What's here

- `index.html` + `css/` + `images/` — the static Webflow-exported page.
- `functions/getInvite.js` — a **Cloudflare Pages Function** (runs at the edge)
  that solves the captcha and mints a Discord invite. It uses the Workers-native
  `fetch`; no Node/AWS dependencies. (This replaced the old AWS Lambda.)

## Make a change and ship it

- Edit the files, open a PR, merge to **`main`**. GitHub Actions
  (`.github/workflows/deploy.yml`) runs `wrangler pages deploy .` to the
  `chat-nano-org` Pages project. Every PR gets a preview URL.
- Discord invite secrets are Cloudflare Pages env vars (set in the dashboard),
  not in git.

## Infra

For the overall nano.org topology and the Cloudflare deploy token, see the
**[shared infra map](https://github.com/nanocurrency/nano-org/blob/main/docs/agents/INFRA.md)**.

## Agent-doc policy — IMPORTANT (this repo is served from its root)

`wrangler pages deploy .` uploads the **entire repo root**, so any root file is
publicly fetchable. To keep agent docs from leaking:

- **`_redirects`** sends `/AGENTS.md` and `/CLAUDE.md` to `/` (301). Cloudflare
  applies `_redirects` before serving static assets and *always* follows them,
  so the markdown is never served even though it is uploaded.
- **`.assetsignore`** additionally asks Wrangler not to upload them.

If you add more agent material (e.g. a `docs/agents/` dir), add a matching
`_redirects` line and verify with:
`curl -sI https://chat.nano.org/AGENTS.md` → expect `301`, no markdown body.
