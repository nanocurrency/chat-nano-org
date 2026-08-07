# CLAUDE.md — chat-nano-org (chat.nano.org)

Full instructions are in **[AGENTS.md](./AGENTS.md)** — read it first. Quick
pointers so the right file is obvious:

- **The landing page** is `index.html` + `css/` + `images/` (a static
  Webflow export).
- **The captcha-gated Discord invite** is the edge Function
  `functions/getInvite.js` (Cloudflare Pages Function; invite secrets are Pages
  env vars, not in git).
- Edit, open a PR, merge to `main` → auto-deploys to Cloudflare Pages; every PR
  gets a preview URL. Undo = revert the commit.
- Overall topology / deploy token → the shared infra map AGENTS.md links.

Heads-up: this repo is **served from its root**, so `AGENTS.md`/`CLAUDE.md` are
stripped at deploy (see AGENTS.md, "agent-doc policy") — add any new agent docs
to that guard.

Task tracking is **beads** — run `bd prime` first.
