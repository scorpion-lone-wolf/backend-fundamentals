# Docker Command Notes

## Common Docker Commands

### 1. Pull an image from Docker Hub

- `docker pull <image-name>`

This downloads an image from a registry (for example Docker Hub) to your local machine.

### 2. Run an image and create a container

- `docker run <image-name>`

If the image is not available locally, Docker will automatically pull it first.

### 3. Run a container interactively

- `docker run -it <image-name>`

Flags:

- `-i` keeps STDIN open.
- `-t` allocates a pseudo-TTY.

Example:

- `docker run -it ubuntu /bin/bash`

This starts a new container and gives you an interactive shell inside it.

### 4. List containers

- `docker ps`
  - Shows only running containers.

- `docker ps -a`
  - Shows all containers, including stopped ones.

### 5. Stop a running container

- `docker stop <container-id|container-name>`

This sends a SIGTERM to the container process and allows it to stop gracefully.

### 6. Remove a container

- `docker rm <container-id|container-name>`

Notes:

- You cannot remove a running container with `docker rm` unless you add `-f` to force removal.
- Usually you stop the container first, then remove it.

## Helpful tips

- `docker run` creates and starts a container from an image.
- `docker pull` only downloads the image; it does not create a container.
- `docker ps` is similar to process listing, but for containers.
- Use `docker ps -a` to see containers in all states.
- Use `docker rm -f <container-id|container-name>` only when you want to force remove a running container.
