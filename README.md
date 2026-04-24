# Constellation Bot

The official Discord bot for the Penny Constellation community. Handles auto-roles, moderation, AI-powered support, invite tracking, ticket management, and the full message archive pipeline for **Penny Eye Search**, **FormlyIQ**, **OurAlert**, and **AlkaidIQ**.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 20, TypeScript (ESM) |
| Discord | discord.js v14 (Gateway + slash commands) |
| Database | Supabase Postgres + pgvector |
| Archive | Cloudflare R2 |
| AI (launch) | Featherless.ai |
| AI (post-canary) | Self-trained models on HuggingFace |
| Host | DigitalOcean App Platform (Worker component) |

---

## Local development

```bash
# Prerequisites: Node 20+, npm
npm install

# Copy env template and fill in from 1Password
cp .env.example .env
# Edit .env — fill in DISCORD_TOKEN, DATABASE_URL, etc.

# Register slash commands to your guild (set DISCORD_GUILD_ID first for instant registration)
npm run register

# Start the bot with hot reload
npm run dev
```

---

## Deploy

DigitalOcean App Platform auto-deploys on every push to `main`. The deployment spec is `.do/app.yaml`.

To deploy for the first time, connect the DO App Platform app to this repo — see the deployment plan at `~/Documents/Cowork/Projects/Constellation Discord/constellation-discord-plan-v2.md` (Phase 1).

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Local development with hot reload via tsx |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled bundle (what DO runs in production) |
| `npm run register` | Push slash command definitions to Discord |
| `npm run typecheck` | Type-check without emitting files |

---

## Environment variables

See `.env.example` for the full list. Public-safe values (app ID, public key, R2 account ID, bucket name, endpoint, Supabase URL) are pre-filled. Secrets (tokens, keys, passwords) must be pulled from 1Password.

In production, values are set via DO App Platform's environment variable UI as secrets — **never** commit actual secrets to this repo.

---

## Commands

Currently shipped:

- `/ping` — confirms the bot is alive, reports gateway latency

Coming soon (tracked in the deployment plan):

- Self-select product roles (button-driven in `#get-your-roles`)
- AutoMod + manual moderation (`/warn`, `/timeout`, `/kick`, `/ban`, `/purge`, `/modlog`)
- Ticket system with AI-first responses
- Invite tracking + `/join` for personal invite links
- Bug-forum mirroring + `/bug report`
- Full `/setup wizard` for guild scaffolding

---

## Architecture overview

```
Discord Gateway ──▶ Bot (DO App Platform Worker)
                       │
                       ├── Operational state ──▶ Supabase Postgres
                       ├── Message archive ────▶ Cloudflare R2
                       └── AI inference ───────▶ Featherless → HF Inference Endpoint
```

---

## License

UNLICENSED — private project. Not for redistribution.
