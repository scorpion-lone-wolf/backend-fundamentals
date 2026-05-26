# ⚡️ Docker Networking Notes

## 🔴 Run a container

Run the `nginx` image in detached mode, remove the container when it stops, and give it a name:

```bash
docker run -d --rm --name nginx-1 nginx
```

## 🔴 Docker network overview

Docker networking controls how containers communicate with each other, with the Docker host, and with external networks.

## 🔴 List Docker networks

Show all networks managed by the Docker Engine:

```bash
docker network ls
```

## 🔴 Default bridge network

When Docker is installed, it creates a default `bridge` network called `bridge`. Containers attached to the default bridge can communicate with each other by container name or IP, but the default bridge has limited isolation and custom network configuration.

## 🔴 Create a custom bridge network

A custom bridge network is usually better than the default bridge because it provides improved name resolution and isolation between your application services.

```bash
docker network create --driver bridge my-custom-network-bridge
```

## 🔴 Run a container on a custom network

Start a container on the custom bridge network instead of the default bridge:

```bash
docker run -d --rm --name my-nginx-1 --network my-custom-network-bridge nginx
```

## 🔴 Inspect container or network details

Use `docker inspect` to see full low-level details for a container or network:

```bash
docker inspect <container-name-or-id>
```

## 🔴 Publish container ports to the host

Bind a container port to a host port so the service is reachable from outside Docker:

```bash
docker run -d --name my-container --network my-custom-network-bridge -p 8080:80 nginx
```

- `-p hostPort:containerPort` maps a port on the Docker host to a port inside the container.
- Use a custom network when containers need to reach each other by name and stay isolated from the default bridge.

---

## 🔴 Question: Can a Docker container have multiple IP addresses?

Yes. A Docker container can have one IP address for each Docker network it is connected to.

### Example

1. Create two bridge networks:

```bash
docker network create frontend-net
docker network create backend-net
```

2. Run a container on the first network:

```bash
docker run -d --rm --name app --network frontend-net nginx
```

3. Attach the second network to the same container:

```bash
docker network connect backend-net app
```

### Notes

- The container now has one IP address on `frontend-net` and one IP address on `backend-net`.
- Use `docker inspect app` to see the IP addresses assigned to the container on each network.
