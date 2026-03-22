# Remote Command Execution (SSH) - Clean Notes

These notes cover SSH basics: version check, login, how key exchange works, and how to set up key-based authentication.

## 1. Check SSH Version

```bash
ssh -V
```

## 2. Login to a Remote Server

```bash
ssh -i my-secret-key-pair.pem username@ipaddress
```

- `-i` specifies the private key file.
- `username@ipaddress` is the remote login.

## 3. Key Exchange (High-Level Flow)

SSH uses key exchange to create a shared secret for encryption.

1. Both sides generate a private random value (kept secret).
2. Each side derives a public value from its private value.
3. They exchange public values.
4. Each side combines its private value with the other side's public value.
5. Both arrive at the same shared secret.
6. That shared secret encrypts the SSH session.

Common algorithm: Diffie-Hellman.

## 4. Authentication Types

- Password (not recommended).
- SSH key (more secure).

## 5. Create SSH Keys and Enable Key Login

### Step 1: Generate an SSH Key Pair (Local Machine)

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

- `-t` = key type (here `rsa`)
- `-b` = key size in bits (here `4096`)
- `-C` = comment/label for the key

Result:

- Private key (kept on your local machine)
- Public key (copied to the server)

### Step 2: Store the Public Key on the Server

1. Log in to the server (using password or existing key).
2. Ensure the `.ssh` directory exists in the user's home directory.

```bash
mkdir -p /home/username/.ssh
```

3. Fix ownership if needed (example user `rahul`):

```bash
sudo chown rahul:rahul /home/rahul/.ssh
```

4. Add the public key to `authorized_keys`:

```bash
vim /home/username/.ssh/authorized_keys
```

- Now copy the id_rsa.pub file content to the file authorized_keys

### Step 3: Login Using the Private Key

```bash
ssh -i "~/.ssh/id_rsa" rahul@ec2-54-234-109-149.compute-1.amazonaws.com
```

- `id_rsa` is the private key.
- The public key must be in `/home/username/.ssh/authorized_keys`.

## 6. Quick Recap

- Generate key pair locally.
- Copy public key to server.
- Login with the private key using `ssh -i`.
