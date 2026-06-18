# Forgers ATS

> An **Applicant Tracking System** built with **Next.js**, **React**, **PostgreSQL**, **Prisma**, and **Docker** — structured around **Clean Architecture**.

Forgers ATS lets recruiters register candidates and advance them through a hiring pipeline (`Applied → Screening → Interview → Offer → Hired`, with `Rejected` reachable from any active stage). The business rules that govern those transitions live entirely in the domain layer, isolated from frameworks and I/O.

---

## Tech Stack

| Concern            | Technology            |
| ------------------ | --------------------- |
| Web framework / UI | Next.js 14 (App Router), React 18 |
| Language           | TypeScript            |
| Database           | PostgreSQL            |
| ORM / migrations   | Prisma                |
| Containerization   | Docker, Docker Compose |
| Validation         | Zod (input only)      |
| Tooling            | ESLint, Prettier      |

---

## Getting Started

### Prerequisites

- Node.js >= 18.18
- Docker & Docker Compose (recommended), or a local PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Adjust `DATABASE_URL` if needed. The default matches the bundled Docker Compose Postgres service.

### 3a. Run everything with Docker (recommended)

```bash
docker compose up --build
```

This starts PostgreSQL and the Next.js app. The app is available at <http://localhost:3000>.

### 3b. Run locally (app on host, DB in Docker)

```bash
# Start only the database
docker compose up -d db

# Generate the Prisma client and apply migrations
npm run prisma:generate
npm run prisma:migrate

# (optional) seed sample candidates
npm run db:seed

# Start the dev server
npm run dev
```

Visit <http://localhost:3000>.

### Useful scripts

| Script                     | Description                              |
| -------------------------- | ---------------------------------------- |
| `npm run dev`              | Start Next.js in development             |
| `npm run build`            | Production build                         |
| `npm run start`            | Start the production server              |
| `npm run lint`             | Run ESLint (incl. layer-boundary rules)  |
| `npm run format`           | Format with Prettier                     |
| `npm run typecheck`        | TypeScript type-check                    |
| `npm run prisma:migrate`   | Create/apply a dev migration             |
| `npm run prisma:studio`    | Open Prisma Studio                       |
| `npm run db:seed`          | Seed sample data                         |

---

## API

| Method  | Path                              | Description                          |
| ------- | --------------------------------- | ------------------------------------ |
| `GET`   | `/api/health`                     | Health check                         |
| `GET`   | `/api/candidates`                 | List candidates                      |
| `POST`  | `/api/candidates`                 | Create a candidate                   |
| `PATCH` | `/api/candidates/:id/stage`       | Move a candidate to a new stage      |

Create a candidate:

```bash
curl -X POST http://localhost:3000/api/candidates \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Grace Hopper","email":"grace@example.com","jobTitle":"Compiler Engineer"}'
```

Move a candidate forward:

```bash
curl -X PATCH http://localhost:3000/api/candidates/<id>/stage \
  -H 'Content-Type: application/json' \
  -d '{"targetStage":"SCREENING"}'
```

There is also a CLI adapter demonstrating an alternate entry point to the same use cases:

```bash
npx ts-node src/interfaces/cli/listCandidates.ts
```

---

## Clean Architecture

Code is organized into four concentric layers. **Dependencies only ever point inward.**

```
interfaces ──▶ application ──▶ domain
infrastructure ──▶ application ──▶ domain
```

```
src/
├── domain/          # Enterprise business rules — knows nothing of the outside world
│   ├── entities/            Candidate (identity + lifecycle, protects invariants)
│   ├── value-objects/       Email, CandidateStage (immutable, validated, transition rules)
│   ├── repositories/        CandidateRepository (interface — WHAT, not HOW)
│   ├── services/            CandidateUniquenessService (cross-entity rule)
│   └── errors/              DomainError hierarchy
│
├── application/     # Use cases / orchestration — depends only on domain
│   ├── use-cases/           CreateCandidate, MoveCandidateStage, ListCandidates (execute(dto))
│   ├── dtos/                Input/output contracts
│   ├── mappers/             Domain entity ↔ DTO
│   ├── ports/               IdGenerator (abstraction implemented by infrastructure)
│   ├── errors/              ApplicationError hierarchy
│   └── AppContainer.ts      Application-owned container contract + resolver
│
├── infrastructure/  # I/O & framework details — implements domain/application abstractions
│   ├── persistence/prisma/  PrismaClient, PrismaCandidateRepository (implements interface)
│   ├── id/                  UuidGenerator (implements IdGenerator port)
│   └── composition/         container.ts (composition root) + bootstrap.ts
│
├── interfaces/      # Adapters / entry points — translate external I/O to use case calls
│   ├── http/controllers/    CandidateController (thin: validate → use case → serialize)
│   ├── http/validation/     Zod schemas (input shape only)
│   ├── http/errors.ts       Maps app/domain errors to HTTP status codes
│   └── cli/                 CLI entry point
│
├── app/             # Next.js App Router (interfaces layer) — pages & route handlers
└── instrumentation.ts  # Startup hook that loads the composition root
```

### The dependency rule in practice

- **`domain/`** imports nothing outside itself — no ORM, no HTTP, no env vars. It holds entities, value objects, repository **interfaces**, and domain services.
- **`application/`** imports only `domain/`. Each use case is one class with an `execute(dto)` method and receives its collaborators via constructor injection. It returns DTOs, never domain entities.
- **`infrastructure/`** implements the interfaces/ports declared by `domain`/`application` (e.g. `PrismaCandidateRepository implements CandidateRepository`). It is the only layer that knows about Prisma, PostgreSQL, and `process.env`.
- **`interfaces/`** depends only on `application/`. Controllers and route handlers validate input, call a use case, and serialize the result. No business logic, no direct DB access.

### How wiring stays clean

The interfaces layer must not import infrastructure directly. To honor that:

1. `application/AppContainer.ts` defines the container **contract** and a `registerContainerFactory` / `resolveContainer` accessor (owned by the application layer).
2. `infrastructure/composition/container.ts` (the **composition root**) is the single place that constructs concrete implementations and registers them with that accessor.
3. `src/instrumentation.ts` loads the composition root once at server startup.
4. Controllers call `resolveContainer()` from the **application** layer — never touching infrastructure.

This makes adapters and infrastructure swappable (swap Prisma for another store, or HTTP for CLI) without changing domain or application code.

---

## License

MIT
