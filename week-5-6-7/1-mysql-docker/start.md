# Docker MySQL Command Arguments Explained

## Run MySQL Container

```bash
docker run --name mysql-server \
  --rm \
  -v $(pwd)/mysql_data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  -d mysql:latest
```

---

## Command Breakdown

### `docker run`

Creates and starts a new container from an image.

---

### `--name mysql-server`

Assigns a custom name to the container.

Container name: `mysql-server`

---

### `--rm`

Automatically removes the container when it stops.

✅ Useful for temporary containers
❌ Not ideal for permanent databases unless using volumes

---

### `-v $(pwd)/mysql_data:/var/lib/mysql`

Mounts a local folder to the container for persistent MySQL data.

#### Format

```text
host_path:container_path
```

#### Meaning

- `$(pwd)/mysql_data` → Folder in your current local directory
- `/var/lib/mysql` → MySQL data directory inside container

✅ Data remains even if container stops or is deleted

---

### `-e`

Sets environment variables inside the container.

#### Examples

```bash
-e MYSQL_ROOT_PASSWORD=root123
```

Sets MySQL root password.

```bash
-e MYSQL_DATABASE=mydb
```

Creates a database named `mydb` when container starts.

---

### `-p 3306:3306`

Maps ports between local machine and container.

#### Format

```text
host_port:container_port
```

#### Meaning

- First `3306` → Port on your local machine
- Second `3306` → MySQL port inside container

✅ Access MySQL using `localhost:3306`

---

### `-d`

Runs container in detached mode (background).

---

### `mysql:latest`

Image name and version tag.

#### Format

```text
image_name:tag
```

#### Meaning

- `mysql` → Docker image name
- `latest` → Latest available version

---

# Access MySQL Database

## Open MySQL Shell Inside Container

```bash
docker exec -it mysql-server mysql -u root -p
```

Then enter password:

```text
root123
```

---

## Useful MySQL Commands

```sql
SHOW DATABASES;
USE mydb;
SHOW TABLES;
```
