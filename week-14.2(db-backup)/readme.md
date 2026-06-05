# DB Backup Setup Notes

## What I did

I set up a simple PostgreSQL backup workflow in Docker Swarm with two services:

1. `my-db`
   - Runs PostgreSQL 16 in a Docker Swarm service.
   - Uses a named volume for database data persistence.
   - Exposes port `5432` for database access.
   - Uses a Swarm secret (`db_password.txt`) to keep the password secure.

2. `my-db-backup`
   - Uses the `prodrigestivill/postgres-backup-local` image.
   - Connects to the PostgreSQL container over the Swarm network.
   - Creates automatic backups on a daily schedule (`@daily`).
   - Keeps backups for 7 days.
   - Also performs an immediate backup at startup (`BACKUP_ON_START=TRUE`).
   - Stores backup files on the host machine using a bind mount to `/home/ubuntu/postgres-stack/backups`.

## Why we do database backup

Backups are important because they help us recover data if something goes wrong.

Common reasons to backup a database:

- Accidentally deleting or changing important data
- Database corruption or crash
- Hardware or server failure
- Bad deployment or migration mistakes
- Security incidents or ransomware attacks
- Need for recovery and business continuity

Without backups, recovery may be impossible or very expensive.

## Why this setup is useful

This setup gives us:

- Automatic backup creation without manual work
- Safe storage of credentials using Docker secrets
- Backup files saved on the host machine for easy recovery
- A repeatable backup process for real-world production environments

## Key idea

The database keeps the live data, and the backup container creates copies of that data regularly so we can restore it later if needed.

## Summary

This folder demonstrates a practical database backup strategy using Docker Swarm:

- database runs in a container
- backup job runs automatically
- backup files are stored on the host
- backups help protect against data loss and downtime
