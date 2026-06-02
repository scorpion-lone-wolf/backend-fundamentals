# Docker Swarm Notes

## What is Docker Swarm?

- Docker Swarm is Docker's clustering tool for running containers across multiple machines.
- It manages services, load balancing, and scaling in a cluster.
- Unlike Docker Compose, Swarm is built for multi-host deployment.

## Key project points

- Use a shared image registry (Docker Hub or another registry) because swarm nodes need the same image.
- For services that depend on a database, use a startup script like `wait-for-it.sh` instead of `depends_on`.
- `depends_on` works in Compose on one machine but not in Swarm across multiple nodes.
- Run only one database replica if you use a local volume. Each node has its own filesystem, so local volumes are not shared.

## Dockerfile changes

- Copy `wait-for-it.sh` into the image.
- Set an `ENTRYPOINT` or `CMD` to run the script before starting the app.
- Build the image for Linux platform if your host is different.

Example commands:

- `docker build --no-cache --platform linux/amd64 -t yourname/my-blog:v1 .`
- `docker push yourname/my-blog:v1`

## Swarm setup

1. Initialize Swarm on the manager node:
   - `docker swarm init`
2. Add worker nodes with the join command shown by `docker swarm init`.
3. Verify nodes:
   - `docker node ls`

## Deploying the stack

- Copy `compose.yml` to the manager node.
- Deploy using:
  - `docker stack deploy -c compose.yml my-stack-name`

## Important networking note

- Docker Compose default network driver is `bridge`.
- Docker Swarm uses `overlay` networks for service-to-service communication across nodes.

## Checking status

- List stacks: `docker stack ls`
- List services: `docker service ls`
- Inspect service: `docker service ps <service-name>`
- Inspect stack resources: `docker stack ps <stack-name>`

## Removing the stack

- `docker stack rm <stack-name>`

## Useful commands reference

- `docker swarm init`
- `docker swarm join --token <token> <manager-ip>:2377`
- `docker node ls`
- `docker stack deploy -c compose.yml <stack-name>`
- `docker stack ls`
- `docker stack ps <stack-name>`
- `docker service ls`
- `docker service ps <service-name>`
- `docker stack rm <stack-name>`
- `docker image ls`
- `docker service scale <service-name>=<replica-count>`

## Simple tips

- Always push your image to a registry before deploying in Swarm.
- Prefer one database replica when using local volumes.
- Use `overlay` networks in Swarm for multi-node communication.
- Keep the startup wait script in the image to avoid crashes when the DB is not ready.

## Scaling services

- In the Compose file or service definition, set the desired replica count.
- Or scale a running service with:
  - `docker service scale <service-name>=10`
- This creates more containers for the service across the Swarm cluster.
