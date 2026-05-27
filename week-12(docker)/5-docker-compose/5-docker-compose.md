<!--
  Docker Compose - structured notes
  Purpose: concise reference for using docker compose in development and simple production setups.
  This file contains: overview, key concepts, a minimal example, common commands, tips and troubleshooting.
-->

# Docker Compose — Notes & Examples

## Overview

Docker Compose lets you define and run multi-container Docker applications using a single YAML file (commonly named `docker-compose.yml` or `compose.yml`).

- Use when an application needs multiple services (app server, database, cache, etc.).
- Compose orchestrates service creation, networking, and volumes for development and simple stacks.

## Key concepts

- **service**: a container definition (image, build, ports, env, volumes).
- **image**: Docker image to run (can be built locally with `build:` or pulled via `image:`).
- **volumes**: persistent storage outside the container filesystem.
- **networks**: isolated networks Compose creates so services can communicate by name.
- **depends_on**: start-order hint (does not wait for service readiness; use healthchecks for that).

## Minimal example (`docker-compose.yml`)

```yaml
# Minimal example with an app and a MySQL service
version: "3.9"

services:
  blog-db:
    # This service runs the MySQL database.
    image: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    volumes:
      - my-blog-vol:/var/lib/mysql
    ports:
      - "3306:3306"
    container_name: my-db-container

  blog-server:
    # This service builds and runs the Express app.
    build:
      dockerfile: Dockerfile
      context: ./
    container_name: my-blog-app-container
    ports:
      - "3000:3000"
    env_file:
      - ./.env
    volumes:
      - ./:/app
    depends_on:
      - blog-db

volumes:
  my-blog-vol:
    # This is a named volume for MySQL data.
    # It keeps database files safe even if the MySQL container is removed.
networks:
  my-blog-network: # it will be bridge network
```

Notes on the example:

- Use `bind` mounts (like `.:/usr/src/app`) only for development — they expose host files to containers.
- Named volumes (like `db-data`) are recommended for database persistence across container restarts.
- `depends_on` ensures container start order but not service readiness. Add `healthcheck` for readiness.

## Common commands

- Start in foreground: `docker compose up`
- Start detached: `docker compose up -d`
- Stop and remove containers/networks: `docker compose down`
- Show running services: `docker compose ps`
- View logs: `docker compose logs -f` (add service name for specific logs)
- Exec into a running container: `docker compose exec service-name sh`

## Best practices & tips

- Keep secrets out of your YAML: use an external secrets manager or environment variables from a secure source.
- Use an `.env` file for non-sensitive environment variables (Compose automatically loads `.env`).
- Prefer explicit image tags (e.g., `mysql:8.0`) to avoid accidental upgrades.
- Add `healthcheck` blocks to services that other services depend on; use tools like `wait-for-it` if needed.
- Use profiles (Compose v2.4+) to enable optional services for local dev vs CI.
- Do not use bind mounts in production; instead, bake code into an image.

## Troubleshooting

- If a service keeps restarting: check `docker compose logs service-name` and inspect healthchecks.
- Network issues between services: ensure both services are on the same Compose network (default behavior).
- Volume permission problems: inspect UID/GID mapping and consider adjusting container user or host permissions.

## Quick checklist for a Compose-based app

- [ ] `docker compose up -d` brings all services up
- [ ] app can connect to database at the service name (e.g., `db:3306`)
- [ ] persistent data is stored in a named volume (not a temporary container filesystem)

## References

- Official docs: https://docs.docker.com/compose/
- Compose file reference: https://docs.docker.com/compose/compose-file/

---

If you want, I can also:

- add a concrete `docker-compose.yml` to this folder and a short `README` with step-by-step run commands,
- or include a `healthcheck` example and a `.env.example` file.
