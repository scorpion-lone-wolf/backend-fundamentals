# Secure File Transfer: SCP & rsync

## 1. SCP (Secure Copy Protocol)

SCP is a command-line tool for securely transferring files between a local machine and a remote server (or between two remote servers) over SSH.

---

### 1.1 Local → Remote (Upload)

**Copy a single file:**

```bash
scp -i /path/to/your-key.pem \
  /local/path/file.txt \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/path/
```

**Copy an entire directory recursively:**

```bash
scp -i /path/to/your-key.pem -r \
  /local/directory/ \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/path/
```

---

### 1.2 Remote → Local (Download)

**Copy a single file:**

```bash
scp -i /path/to/your-key.pem \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/path/file.txt \
  /local/path/
```

**Copy an entire directory recursively:**

```bash
scp -i /path/to/your-key.pem -r \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/directory/ \
  /local/path/
```

---

### 1.3 Common SCP Flags

| Flag | Meaning                                                    |
| ---- | ---------------------------------------------------------- |
| `-i` | Specify the private key (identity file) for authentication |
| `-r` | Recursively copy an entire directory                       |

---

## 2. rsync (Remote Sync)

`rsync` is a more powerful and efficient alternative to `scp`. Unlike SCP, which always copies the entire file, `rsync` uses **delta transfer** — it only transfers the parts of a file that have changed. This makes it significantly faster for large or repeated transfers.

### 2.1 Basic Syntax

**Remote → Local (Download):**

```bash
rsync -avz --progress -e "ssh -i /path/to/your-key.pem" \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/path/ \
  /local/path/
```

**Local → Remote (Upload):**

```bash
rsync -avz --progress -e "ssh -i /path/to/your-key.pem" \
  /local/path/ \
  ec2-user@ec2-xx-xx-xx-xx.compute-1.amazonaws.com:/remote/path/
```

---

### 2.2 Common rsync Flags

| Flag         | Name         | Description                                                                                                           |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `-a`         | Archive mode | Preserves permissions, ownership, timestamps, symbolic links, and recurses into directories. Equivalent to `-rlptgoD` |
| `-v`         | Verbose      | Shows detailed output of what's being transferred                                                                     |
| `-z`         | Compress     | Compresses data during transfer to reduce bandwidth usage — useful on slow connections                                |
| `--progress` | Progress     | Displays real-time transfer progress for each file                                                                    |
| `-e`         | Execute      | Specifies the remote shell to use (here, SSH with a key)                                                              |

---

## 3. SCP vs rsync — Key Differences

| Feature                     | SCP                                  | rsync                                             |
| --------------------------- | ------------------------------------ | ------------------------------------------------- |
| Transfer method             | Copies the entire file every time    | Transfers only the changed parts (delta transfer) |
| Speed (repeated transfers)  | Slower — always re-copies everything | Faster — skips unchanged data                     |
| Bandwidth efficiency        | Low                                  | High                                              |
| Preserves metadata          | Basic                                | Yes (with `-a` flag)                              |
| Resume interrupted transfer | ❌ No                                | ✅ Yes                                            |
| Ease of use                 | Simple and straightforward           | Slightly more options, but still easy             |

> **Recommendation:** Use `scp` for quick, one-off transfers. Prefer `rsync` for large files, repeated syncs, or when bandwidth is limited.
