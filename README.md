# test-qa-pipeline-001

A simple Next.js 14 + Tailwind CSS todo list application with a minimal REST API and SQLite persistence via Prisma.

## Features
- Create, list, edit, complete, and delete tasks
- Responsive dashboard with filters and search
- Optimistic UI updates for completion toggles
- REST API endpoints for task CRUD and health checks
- SQLite persistence via Prisma

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- Jest + React Testing Library
- Playwright

## Prerequisites
- Node.js 18+
- npm

## Quick Start
```bash
./install.sh
# or on Windows
./install.ps1
```
Then run:
```bash
npm run dev
```

## Environment Variables
See `.env.example`:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

## Project Structure
```
src/
  app/               # App Router pages, layouts, API routes
  components/        # Reusable UI components
  providers/         # Auth and toast providers
  lib/               # Utilities and API client
  types/             # Shared TypeScript types
prisma/              # Prisma schema and seed
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/tasks` - List tasks (supports `completed`, `q`, `limit`, `offset`)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Toggle completion
- `DELETE /api/tasks/:id` - Delete task

## Available Scripts
- `npm run dev` - Start dev server
- `npm run build` - Generate Prisma client and build
- `npm run start` - Start production server
- `npm run lint` - Lint code
- `npm run test` - Run Jest tests
- `npm run e2e` - Run Playwright tests
- `npm run db:push` - Push Prisma schema to DB

## Testing
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright

## Notes
- SQLite is the default database. Update `DATABASE_URL` for other providers.
- Authentication is optional and scaffolded for future use.
