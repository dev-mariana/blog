# Blog (Nuxt + Prisma)

This repository is a minimal blog application built with Nuxt (Vue 3) and Prisma. It provides a small admin interface to create, edit, publish and delete posts, and a public listing of blog posts.

## Architecture

- **Frontend:** Nuxt (Vue 3) with server routes in the `server/api` folder. Pages live in `app/pages`.
- **Backend / API:** Server routes implemented using the built-in Nuxt server API (`server/api`). Controllers, services and repositories are under `server/controllers`, `server/services` and `server/repositories`.
- **Database:** PostgreSQL (configured via Prisma). Schema is in `prisma/schema.prisma` and generated client code is in `prisma/generated`.
- **Data access:** `server/repositories` wraps Prisma Client calls; controllers call services which use repositories.

## Key folders

- `app/` — Nuxt pages, components and assets.
- `server/` — API routes, controllers, services, dtos and repositories.
- `prisma/` — Prisma schema, migrations and generated client.
- `public/` — Static assets.

## Technologies

- Nuxt 4 (Vue 3)
- TypeScript
- Prisma (Postgres)
- Tailwind CSS
- Docker & docker-compose (for local Postgres)

## Get the code

Clone the repository:

```bash
git clone <repo-url> my-blog
cd my-blog
```

Replace `<repo-url>` with the repository SSH/HTTPS URL.

## Install dependencies

Using npm:

```bash
npm install
```

Or with pnpm/yarn:

```bash
pnpm install

yarn install
```

## Environment

Copy the environment example (if present) and update values, especially the database URL:

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL, PORT, and other keys as needed
```

## Run with Docker (recommended for local development)

This project includes a `docker-compose.yml` to start a Postgres database. To run with Docker:

```bash
docker-compose up --build
```

This will build and start the services. Logs will show on the console. The app typically runs on `http://localhost:3000`.

To stop and remove containers:

```bash
docker-compose down
```

## Run locally (without Docker)

1. Make sure Postgres is available and `DATABASE_URL` in `.env` points to it.
2. Generate Prisma client (if needed):

```bash
npm run prisma:generate
```

3. Run migrations (only if you want to apply migrations locally):

```bash
npm run prisma:migrate
```

4. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000/blogs` to view the posts list and test features (create, list, edit, delete).

## Troubleshooting

- If you see Prisma errors, ensure `DATABASE_URL` is correct and run `npx prisma studio` or `npx prisma migrate status` to inspect the DB.
- If ports conflict, adjust `PORT` in `.env` or Docker compose.

## Contributing

Feel free to open issues or PRs. For local development, follow the steps above to run and test changes.
