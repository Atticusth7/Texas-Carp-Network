# CLAUDE.md — Texas Carp Network

This file provides context, conventions, and workflows for AI assistants (Claude Code and others) working in this repository.

## Project Overview

**Texas Carp Network** is a web application for Texas carp fishermen. It is currently in the initial setup phase with no application code yet written. This file documents the intended conventions and workflows to follow as the project is built out.

- **Repository:** Atticusth7/Texas-Carp-Network
- **Current State:** Initial commit only — README.md is the sole tracked file
- **Goal:** A community/utility web app serving Texas carp fishing enthusiasts

---

## Repository Structure (Intended)

As the project grows, follow this structure:

```
Texas-Carp-Network/
├── CLAUDE.md              # This file
├── README.md              # Project overview and setup instructions
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies and scripts
├── .env.example           # Example environment variables (never commit .env)
├── src/                   # Application source code
│   ├── client/            # Frontend application
│   └── server/            # Backend API
├── public/                # Static assets
├── tests/                 # Test files mirroring src/ structure
├── docs/                  # Additional documentation
└── scripts/               # Utility scripts
```

---

## Tech Stack

No stack has been chosen yet. When beginning development, decisions should be documented here. Common patterns for a project like this:

- **Frontend:** React or Next.js with TypeScript
- **Backend:** Node.js/Express or Next.js API routes
- **Database:** PostgreSQL or SQLite (via Prisma or Drizzle ORM)
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js or Clerk
- **Testing:** Vitest + React Testing Library

**When a stack is chosen, update this section with the actual choices.**

---

## Git Workflow

### Branch Naming

- `main` / `master` — stable production code
- `claude/<feature-slug>` — AI-assisted development branches
- `feature/<feature-slug>` — human-led feature branches
- `fix/<issue-slug>` — bug fixes
- `chore/<task-slug>` — maintenance tasks

### Commit Conventions

Use imperative, present-tense commit messages:

```
Add user authentication module
Fix map rendering bug on mobile
Update fishing spot API endpoint
```

- Keep the subject line under 72 characters
- Reference issue numbers when applicable: `Fix map zoom (#42)`

### Push Rules

- Never push directly to `master` or `main` without review
- Always push AI-developed code to a `claude/` branch
- Use `git push -u origin <branch-name>` when pushing a new branch

---

## Development Workflows

### Starting Fresh (Project Bootstrap)

When setting up the application for the first time:

1. Initialize the package manager and framework
2. Create `.gitignore` (use gitignore.io for the chosen stack)
3. Add `.env.example` with all required variables documented
4. Configure linting and formatting (ESLint + Prettier)
5. Set up a basic test runner
6. Update README.md with setup and run instructions

### Adding a New Feature

1. Create a branch: `git checkout -b feature/<name>`
2. Write tests first when practical
3. Implement the feature
4. Run linting and tests before committing
5. Write a clear commit message
6. Push and open a PR

### Running the Project

No scripts exist yet. Once package.json is added, document commands here:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Code Conventions

### General

- Use **TypeScript** if a typed language is chosen — prefer explicit types over `any`
- Prefer **named exports** over default exports for better refactoring support
- Keep files small and focused — one primary concern per file
- Use descriptive variable and function names; avoid abbreviations

### File Naming

- React components: `PascalCase.tsx` (e.g., `FishingSpotCard.tsx`)
- Utilities/hooks: `camelCase.ts` (e.g., `useFishingSpots.ts`)
- Test files: co-located or in `tests/`, named `<file>.test.ts`
- Constants: `SCREAMING_SNAKE_CASE` for true constants

### Environment Variables

- Never commit `.env` files
- Always maintain `.env.example` with placeholder values and comments
- Prefix client-side env vars per framework convention (e.g., `NEXT_PUBLIC_`, `VITE_`)

### Error Handling

- Always handle async errors — use try/catch or `.catch()` consistently
- Return meaningful error messages from API endpoints
- Log errors server-side; show user-friendly messages client-side

---

## Testing

No testing framework is configured yet. When added:

- **Unit tests** for utility functions and hooks
- **Integration tests** for API endpoints
- **Component tests** for UI with React Testing Library
- Aim for meaningful coverage of critical paths, not arbitrary percentage targets

---

## Security Practices

- Never hardcode credentials, API keys, or secrets in source files
- Validate and sanitize all user input on the server side
- Use parameterized queries — never string-interpolate SQL
- Keep dependencies updated; address known vulnerabilities promptly

---

## AI Assistant Guidelines

When Claude Code or another AI assistant works in this repo:

1. **Read before editing** — always read existing files before modifying them
2. **Minimal changes** — make only the changes necessary to fulfill the request; do not refactor unrelated code
3. **No speculation** — do not add features, configs, or abstractions not explicitly requested
4. **Document decisions** — if a significant architectural choice is made, update this file or README.md
5. **Use the designated branch** — all AI-assisted work goes on a `claude/` branch; never push to `master` directly
6. **Test before committing** — run linting and tests (once configured) before finalizing commits
7. **Update CLAUDE.md** — as the project grows and conventions are established, keep this file current

---

## Notes for Future Contributors

This project is in its earliest stage. The conventions above are intentional starting points. As real implementation decisions are made, update this file to reflect:

- Actual tech stack choices
- Real script names from package.json
- Database schema overview
- Authentication approach
- Deployment targets and CI/CD setup
