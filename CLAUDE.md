# CLAUDE.md — Texas Carp Network

This file provides context, conventions, and workflows for AI assistants (Claude Code and others) working in this repository.

## Project Overview

**Texas Carp Network** is a community web app for Texas carp fishermen to:
- Log and share **catches** (species, weight, length, location, photos)
- Record **gear used** (rod, reel, line, hook, bait, rig) per catch
- Log **water conditions** (temp, clarity, depth, current, weather) per catch
- Write and share community **posts** (tips, stories, questions)
- View other anglers' profiles with their catch and post history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk (`@clerk/nextjs` v6) |
| ORM | Prisma v5 |
| Database | PostgreSQL (Neon, Supabase, or Railway recommended) |
| Image Storage | Cloudinary |
| Deployment | Vercel |

---

## Directory Structure

```
Texas-Carp-Network/
├── CLAUDE.md
├── README.md
├── .env.example                # Required env vars (copy to .env for local dev)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── middleware.ts               # Clerk auth middleware (protects routes)
├── prisma/
│   └── schema.prisma           # Database schema (User, Catch, Gear, WaterConditions, Post)
└── src/
    ├── app/
    │   ├── layout.tsx           # Root layout with ClerkProvider + Navbar + Footer
    │   ├── globals.css          # Tailwind base + reusable CSS classes
    │   ├── page.tsx             # Home / feed page
    │   ├── (auth)/              # Clerk auth pages (sign-in, sign-up)
    │   ├── catches/
    │   │   ├── page.tsx         # All catches list
    │   │   ├── new/page.tsx     # Log a new catch (protected)
    │   │   └── [id]/page.tsx    # Single catch detail
    │   ├── posts/
    │   │   ├── page.tsx         # All posts list
    │   │   ├── new/page.tsx     # Create a new post (protected)
    │   │   └── [id]/page.tsx    # Single post detail
    │   ├── profile/
    │   │   └── [username]/page.tsx  # User profile page
    │   └── api/
    │       ├── catches/
    │       │   ├── route.ts         # GET all, POST create
    │       │   └── [id]/route.ts    # GET one, DELETE
    │       ├── posts/
    │       │   ├── route.ts         # GET all, POST create
    │       │   └── [id]/route.ts    # GET one, DELETE
    │       ├── upload/route.ts      # POST image → Cloudinary
    │       └── webhooks/clerk/route.ts  # Clerk user sync webhook
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   ├── catches/
    │   │   ├── CatchCard.tsx    # Card shown in lists
    │   │   └── CatchForm.tsx    # Full catch submission form (client component)
    │   ├── posts/
    │   │   ├── PostCard.tsx
    │   │   └── PostForm.tsx
    │   └── shared/
    │       └── ImageUpload.tsx  # Drag-and-drop photo upload to Cloudinary
    ├── lib/
    │   ├── prisma.ts            # Prisma client singleton
    │   ├── cloudinary.ts        # Cloudinary upload helper
    │   └── utils.ts             # Formatters + constants (species, gear types, etc.)
    └── types/
        └── index.ts             # Shared TypeScript types (CatchWithRelations, etc.)
```

---

## Database Schema

### Models

| Model | Key Fields |
|---|---|
| `User` | `id` (Clerk ID), `username`, `email`, `name`, `bio`, `avatarUrl` |
| `Catch` | `userId`, `title`, `species`, `weightLbs`, `lengthIn`, `location`, `photos[]`, `caughtAt` |
| `Gear` | `catchId`, `type`, `brand`, `model`, `description` |
| `WaterConditions` | `catchId`, `tempF`, `clarity`, `depthFt`, `currentSpeed`, `weather`, `airTempF`, `windMph`, `notes` |
| `Post` | `userId`, `title`, `content`, `photos[]` |

### Relations
- `User` → many `Catch`, many `Post`
- `Catch` → many `Gear`, one `WaterConditions`

---

## Local Development Setup

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in all values in .env
```

Required services (all have free tiers):
- **Clerk** → https://clerk.com — create project, copy publishable + secret key
- **PostgreSQL** → Neon (https://neon.tech) or Supabase (https://supabase.com) — copy `DATABASE_URL`
- **Cloudinary** → https://cloudinary.com — copy cloud name, API key, secret

### 3. Push database schema

```bash
npm run db:push       # Push schema to DB (dev, no migration history)
# or
npm run db:migrate    # Create and run migrations (preferred for production)
```

### 4. Set up Clerk webhook

In the Clerk dashboard, create a webhook pointing to:
```
https://your-domain.com/api/webhooks/clerk
```
Subscribe to events: `user.created`, `user.updated`, `user.deleted`

Copy the webhook signing secret to `CLERK_WEBHOOK_SECRET` in `.env`.

### 5. Run dev server

```bash
npm run dev
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Generate Prisma client + build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database (no migration files)
npm run db:migrate   # Run migrations (generates migration files)
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:reset     # Reset database and re-run all migrations
```

---

## Deployment (Vercel)

### One-time setup

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add all environment variables from `.env` in Vercel project settings
4. Deploy — Vercel auto-detects Next.js

### Build command

The `build` script in `package.json` runs `prisma generate && next build`, so Vercel will generate the Prisma client automatically.

### Database

Use Neon (https://neon.tech) for free managed Postgres that works natively with Vercel. Add the connection string as `DATABASE_URL`.

---

## Auth Flow (Clerk)

- Protected routes: `/catches/new`, `/posts/new`, `/profile/*`
- Protection enforced in `middleware.ts` using `clerkMiddleware` + `createRouteMatcher`
- Users are synced to the local `User` table via Clerk webhooks (`/api/webhooks/clerk`)
- **Must set up the webhook** before users can post — the API checks for a local user record

---

## Image Upload Flow

1. Client selects file via `ImageUpload` component
2. File is `POST`ed to `/api/upload` as `multipart/form-data`
3. Server validates file type (JPEG/PNG/WebP/GIF) and size (≤10MB)
4. Server uploads to Cloudinary via `cloudinary.uploader.upload_stream`
5. Cloudinary URL is returned and stored in the `photos` array of a catch or post

---

## CSS Conventions

Reusable classes are defined in `globals.css` using `@layer components`:

| Class | Usage |
|---|---|
| `.btn-primary` | Green primary action button |
| `.btn-secondary` | Outlined secondary button |
| `.btn-danger` | Red destructive action button |
| `.card` | White rounded card with border + shadow |
| `.input` | Styled form input / select / textarea |
| `.label` | Form field label |
| `.badge`, `.badge-green`, `.badge-blue`, `.badge-gray` | Small inline labels |
| `.section-title` | Large section heading |

---

## Git Workflow

### Branch Naming

- `main` / `master` — stable production code
- `claude/<feature-slug>` — AI-assisted development branches
- `feature/<feature-slug>` — human-led features
- `fix/<slug>` — bug fixes

### Commit Conventions

Use imperative present-tense messages:
```
Add gear detail section to catch form
Fix water conditions not saving on create
Update Navbar with mobile catch button
```

---

## AI Assistant Guidelines

1. **Read before editing** — always read existing files before modifying
2. **Minimal changes** — only change what's requested; don't refactor unrelated code
3. **No speculation** — don't add features, configs, or abstractions not explicitly asked for
4. **Maintain types** — update `src/types/index.ts` when Prisma schema changes
5. **Use designated branch** — all AI work goes on a `claude/` branch
6. **Run lint before committing** — `npm run lint`
7. **Update this file** — when conventions or stack decisions change, update CLAUDE.md
8. **After Prisma schema changes** — always run `npm run db:generate` and update types
