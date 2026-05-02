# Database Scaling

## Overview

As the load on a database increases, its performance tends to degrade over time. This increased load often stems from a growing number of users, which leads to higher storage requirements and can eventually hit storage limits. To mitigate these issues, we can employ either **Vertical Scaling** or **Horizontal Scaling**.

---

## Vertical Scaling

- **Also known as:** Scale Up / Scale Down
- **Definition:** Adding more resources and power (CPU, RAM, Storage) to the same existing system, increasing its capability and capacity to handle more data.
- **Problem:**
  - There is a risk of hitting hardware limits (you cannot upgrade a single machine indefinitely).
  - It becomes very costly to acquire systems with very high specifications.

---

## Horizontal Scaling

- **Also known as:** Scale In / Scale Out
- **Definition:** Adding more systems to the existing infrastructure to distribute the load, so no single system gets overwhelmed.
- **Problem:**
  - It can become complicated to manage and address, as data is now stored across multiple systems.
  - Requires strategies like sharding or replication to ensure data consistency and availability.

---

> **Note:** There is no universally "right" or "wrong" approach. The choice between vertical and horizontal scaling depends entirely on your specific problem statement and requirements.
