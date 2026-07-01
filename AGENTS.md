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
publicly fetchable. Cloudflare Pages serves a **static asset in preference to a
`_redirects` rule**, so a redirect alone does *not* stop an uploaded file from
being served (`.assetsignore` is a Workers-Assets feature and is not honored by
`pages deploy` either). The reliable guard is therefore to **not upload them**:

- **`.github/workflows/deploy.yml`** runs `rm -f AGENTS.md CLAUDE.md` on the CI
  checkout right before `wrangler pages deploy .`, so the files are never part
  of the deployment.
- **`_redirects`** still lists `/AGENTS.md` and `/CLAUDE.md` → `/` (301). With
  the assets removed at deploy, that redirect now actually fires (a request
  returns a 301, not the markdown).

If you add more agent material (e.g. a `docs/agents/` dir), add it to the
`rm -f` list in the workflow **and** a matching `_redirects` line, then verify:
`curl -sI https://chat.nano.org/AGENTS.md` → expect `301`, no markdown body.
