<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shared Context & Rules

## Obsidian Memory Integration
- **Vault Location**: `/Users/meinardga/Documents/Obsidian/Meinard`
- This vault is Meinard's canonical, human-readable cross-assistant knowledge base.
- **Reading Protocol**: Read `00 System/AI Memory/Index.md` -> `Protocol.md` -> `Current Focus.md` -> relevant project notes. Do not scan the entire vault by default. Current repository state and user requests are more authoritative than memory notes.
- **Writing Protocol**: Update memory only when explicitly instructed, when a durable project decision is confirmed, or on session handoff. Never store secrets, tokens, private credentials, or unverified assumptions.

## Implementation Workflow (Coding Tickets)

### Git & Database Restrictions (Strict)
- **Never** create or switch branches, commit, push, open a PR, deploy, or run migrations against any database. Meinard handles Git.
- **Never** use `drizzle-kit push`.
- Suggest a branch name at the end of the task (Meinard creates it).

### Model Selection by Task Weight
- **Light / medium tasks**: Standard / fast model.
- **Heavy tasks**: Flagship / deep reasoning model (cross-repo, migrations, authorization/security, salary/payroll, broad refactors, unclear root causes).

### Code Editing Philosophy & "Ladder"
- Apply the ladder before the first edit: Does it need to exist? -> Reuse existing codebase -> Stdlib -> Native platform -> Installed dependency -> One line -> Minimum code.
- Make the smallest change that fixes the root cause.
- Check `git status` first: Leave unrelated working-tree changes alone; report dirty files not touched.
- **Graphify First**: In repos with `graphify-out/graph.json`, locate code with `graphify query`, `graphify explain`, or `graphify path` before grep/glob.

### Frontend Architecture & Project Structure
- Route-based `app/` structure with feature-first domain organization:
  - Routing in `src/app/` (`page`, `layout`, `loading`, `error`, `not-found`, `route`). Keep route pages thin.
  - Domain-specific components, actions, queries, schemas, types, and tests in `src/features/<domain>/`.
  - Generic UI primitives in `src/components/ui/`.
  - Shared auth UI in `src/components/auth/`, shell UI in `src/components/shell/`, landing UI in `src/components/landing/`.
  - Shared infrastructure and utilities in `src/lib/`.
  - Static assets in `public/`.
  - Kebab-case filenames, preserve `@/*` alias, colocate tests, avoid vague files (`helpers.ts`, `common.ts`).
  - Strict dependency direction: routes -> features/components -> shared lib. Never import feature code into generic UI or shared libraries. Keep server-only code out of client components; avoid circular imports.

### Design, UI/UX & Grilling Stack
- **Design Workflow**: Always invoke `design-taste-frontend` (Taste) first, then `ui-ux-pro-max`, for any design or UI/UX work in every project.
- **Craft Floor**: Run `impeccable` for UI/UX work (check desktop/mobile, light/dark, craft floor).
- **Grilling (`grill-me`)**: Before a spec or plan for a new feature, redesign, or ticket with open questions, grill in rounds: number questions with settled prereqs, give recommended answers, wait for answers before next round. Look up facts in repo/vault yourself; put only decisions to Meinard. Write nothing during grilling.

### Backend Workflow
- Follow repository `AGENTS.md` and strict TDD. Pure domain rule first -> failing focused test -> enforce rule before persistence -> keep authorization/history intact -> return right client-facing error.

### Verification & Code Review
- Run focused tests, lint, typecheck, and relevant build. Report pre-existing failures separately.
- **Review in a Separate Subagent**: Reviews run in a separate subagent, never by the agent that wrote the code.
- Run `code-reviewer` and `code-review-and-quality` (findings labeled: Critical / Required / Optional / Nit).
- Pre-merge check: `security-review` and `security-audit` on the branch diff against `develop`.
- **End-of-Task Report Format**:
  1. Files changed
  2. Root cause and chosen seam
  3. Tests and checks run, with results
  4. Review findings fixed
  5. Open product decisions or pre-existing failures
  6. Suggested branch name
