# RentalHouseApp Client

A production-grade, role-based rental platform frontend built with Next.js App Router. It delivers a polished public landing experience, a map-first search workflow, and dedicated dashboards for tenants and managers.

<img width="1920" height="3848" alt="screencapture-localhost-3000-landing-2026-06-06-18_03_59" src="https://github.com/user-attachments/assets/d48a8f61-ee52-4659-8512-bca3573c57bc" />



## Highlights

- Map-driven search with dynamic filters and live URL sync for shareable results.
- Role-based UX with separate tenant and manager dashboard experiences.
- Internationalization (English + Arabic) with RTL-aware styling.
- End-to-end flows for applications, favorites, and evaluations.
- Strong UI foundation using Radix UI, TailwindCSS, and Framer Motion.

## Features

- Public landing page, marketing sections, and CTA flow.
- Interactive search with Mapbox GL, listings, and advanced filters.
- Auth with AWS Cognito via Amplify UI, including role selection.
- Manager tools: property creation, visibility control, and portfolio views.
- Tenant tools: favorites, applications, and residences.
- Reputation and review components for trust-building signals.
- Toast-driven feedback and consistent loading states.

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Redux Toolkit + RTK Query for API data access
- TailwindCSS + Radix UI primitives
- Mapbox GL + Turf.js for map visualization
- AWS Amplify UI for authentication workflows
- Zod + React Hook Form for validation

## Project Structure

```
client/
	src/
		app/                 # App Router pages and layouts
		components/          # Reusable UI and feature components
		hooks/               # Custom hooks (activity log, currency, etc.)
		i18n/                # next-intl configuration
		lib/                 # Utilities, schemas, constants
		state/               # Redux store + RTK Query API
		types/               # Shared TypeScript types
	messages/              # Translation files (en, ar)
```

## Key Routes

- Landing page and marketing flow: [src/app/(nondashboard)/landing/page.tsx](client/src/app/(nondashboard)/landing/page.tsx)
- Search experience with map + filters: [src/app/(nondashboard)/search/page.tsx](client/src/app/(nondashboard)/search/page.tsx)
- Auth experience and role selection: [src/app/(auth)/authProvider.tsx](client/src/app/(auth)/authProvider.tsx)

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 9+ (or pnpm/yarn/bun)

### Install

```bash
cd client
npm install
```

### Environment Variables

Create a `client/.env` file with the following values:

```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_AWS_COGNITO_APP_CLIENT_ID=
```

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` - Start the dev server
- `npm run build` - Production build
- `npm run start` - Run the production server
- `npm run lint` - Lint the project

## Quality and Engineering Notes

- Type-safe API access via RTK Query and shared Prisma-aligned types.
- Defensive UI states (loading, empty, error) baked into list and detail views.
- Clean separation between public routes and authenticated dashboards.
- URL-synced filters for shareable, reproducible searches.

## What This Project Demonstrates

- Building multi-role product experiences with clear UX boundaries.
- Integrating external services (Cognito, Mapbox, API backend) securely.
- Designing scalable UI systems with consistent styling and animations.
- Delivering production-ready frontend architecture with strong typing.

## Related Docs

- Full feature walkthrough: [docs/FEATURES_DOCUMENTATION.md](docs/FEATURES_DOCUMENTATION.md)

---

If you are reviewing this as a recruiter or hiring manager, feel free to explore the search experience, the tenant and manager dashboards, and the auth flow to get a full picture of the product surface.
