# JUAS Adventure Fest 3.0 — Gamified Event & Registration Platform

> **"Wild Campus Meets Neon Quest"**  
> Presented jointly by the **Jahangirnagar University Adventure Society (JUAS)** and **JU Science Club (JUSC)**.  
> Official Repository: [https://github.com/ManamiMayoki/JUAS_Adventure_Fest_3.0.git](https://github.com/ManamiMayoki/JUAS_Adventure_Fest_3.0.git)

---

## 🌟 Executive Overview & Architecture

JUAS Adventure Fest 3.0 transforms traditional university event registration into an **interactive, open-world quest experience**. Blending the sun-drenched neon palette of retro coastal action RPGs with modern corporate precision, the platform features Jahangirnagar University's iconic **Golden Jackal / Fox** mascot and **Siberian Migratory Birds**.

Designed for **1,000+ concurrent participants** on an **Azure B2s/B2ms Linux VM** (provisioned via GitHub Student Developer Pack):
- **Frontend:** React 18, Vite, Tailwind CSS, Three.js (`@react-three/fiber`, `@react-three/drei`), Web Audio API tactical sound effects, responsive HUD widgets (Wanted Star Meter & Campus Radar).
- **Backend:** Node.js multi-core cluster mode, Express, MongoDB with Mongoose connection pooling (`maxPoolSize: 50`) & compound indexing, Redis in-memory caching with graceful local fallback.
- **Organizer Portal:** Restricted RBAC portal with live per-head & break-even financial simulator, categorized expense ledger, and CSV/PDF export.

---

## 📦 Repository Structure

```text
JUAS_Adventure_Fest_3.0/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # PR linting, tests & build checks
│       └── deploy-production.yml      # CD to Azure VM via SSH & GHCR
├── client/                            # React 18 + Three.js + Tailwind Frontend
│   ├── public/
│   │   ├── assets/logos/              # Fallback SVGs (JUAS, JUSC, Fest Badge)
│   │   ├── assets/models/             # 3D GLTF/GLB models & procedural fallbacks
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/                    # Wilderness diorama, 3D Fox & Migratory Birds
│   │   │   ├── hud/                   # Wanted Star Meter, Campus Radar, Telemetry
│   │   │   ├── missions/              # GTA-style Mission Cards, Rulebook Modal
│   │   │   ├── registration/          # 4-step wizard, QR Mission Pass generator
│   │   │   ├── dashboard/             # Participant Pass Lookup modal
│   │   │   ├── organizer/             # Cost & Budget Ledger, Break-Even Simulator
│   │   │   └── layout/                # Responsive tactical Navbar & Footer
│   │   ├── context/                   # AuthContext, AudioContext, QuestContext
│   │   └── services/api.js            # Axios client with credentials
│   ├── Dockerfile                     # Multi-stage production Nginx container
│   ├── Dockerfile.dev                 # Hot-reloading development container
│   ├── nginx.conf                     # Static asset caching & Gzip compression
│   └── vite.config.js
├── server/                            # High-concurrency Express API
│   ├── src/
│   │   ├── config/                    # db.js (pool: 50), redis.js (resilient fallback)
│   │   ├── controllers/               # Auth, Segments, Registrations, Budget, Analytics
│   │   ├── middleware/                # JWT protect, RBAC authorize, Rate limiter, Zod
│   │   ├── models/                    # User, Segment, Registration, BudgetItem, AuditLog
│   │   ├── routes/                    # API route definitions
│   │   ├── utils/                     # QR generator, logger, seedData
│   │   ├── cluster.js                 # Multi-core cluster mode launcher
│   │   ├── server.js                  # Express application setup
│   │   └── seed.js                    # Database seeder
│   ├── Dockerfile                     # Production Node 20 Alpine container
│   └── tests/server.test.js           # Integration & configuration test suite
├── nginx/
│   ├── nginx.conf                     # Global worker connections & Gzip
│   └── default.conf                   # Reverse proxy routing /api to server
├── docker-compose.yml                 # Local dev orchestration
├── docker-compose.prod.yml            # Production Azure VM orchestration
├── .env.example                       # Environment template
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js LTS (v20+ or v22+)
- MongoDB running locally on port 27017 (or MongoDB Atlas connection string)
- Redis running locally on port 6379 (optional; the app automatically falls back to high-speed in-memory cache if Redis is absent)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ManamiMayoki/JUAS_Adventure_Fest_3.0.git
cd "JUAS_Adventure_Fest_3.0"

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` in both root and `server/`:
```bash
cp .env.example server/.env
```

### 3. Seed the Database
Populates the 6 event segments, organizer credentials, realistic budget line items, and sample registrations:
```bash
npm run seed
```

**Default Organizer Credentials:**
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@juas.org` | `AdventureFest2026!` |
| **Organizer** | `organizer@juas.org` | `WildQuest2026!` |

### 4. Run the Full Stack App
In two separate terminals (or with Docker):
```bash
# Terminal 1: Backend Server (Port 5000)
cd server && npm run dev

# Terminal 2: Frontend Client (Port 3000)
cd client && npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Docker Deployment (One-Command)

### Local Dev with Docker Compose:
```bash
docker compose up --build
```
Runs Client on `:3000`, Server on `:5000`, MongoDB on `:27017`, and Redis on `:6379`.

### Production Simulation:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```
Runs production Nginx reverse proxy on `:80` and `:443`.

---

## 🌿 Git Branching Strategy & Initial Push Commands

Follow this branching structure:
1. `development` — Active feature integration and staging preview.
2. `release` — Pre-production QA, freeze, and load testing.
3. `production` — Live event build deployed directly to the Azure VM.

### Commands to initialize and push all branches:

```bash
# Verify git status
git status

# Add all files and make initial commit
git add .
git commit -m "feat: complete JUAS Adventure Fest 3.0 platform with 3D canvas, HUD, registration & budget portal"

# 1. Main / Production branch
git branch -M production
git push -u origin production

# 2. Release branch
git checkout -b release
git push -u origin release

# 3. Development branch
git checkout -b development
git push -u origin development
```

---

## ☁️ Azure VM Deployment Guide (GitHub Student Pack)

### 1. Provision Ubuntu Linux VM
- Choose **Ubuntu 22.04 LTS** or **24.04 LTS** (Size: `Standard_B2s` or `Standard_B2ms`).
- In Azure Portal Networking settings, open inbound ports:
  - `22` (SSH)
  - `80` (HTTP)
  - `443` (HTTPS)

### 2. Connect and Install Docker Engine
SSH into your Azure VM:
```bash
ssh azureuser@<YOUR_AZURE_VM_IP>

# Update and install Docker + Compose plugin
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Deploy Project on Azure
```bash
sudo mkdir -p /opt/juas-adventure-fest-3.0
sudo chown -R $USER:$USER /opt/juas-adventure-fest-3.0
cd /opt/juas-adventure-fest-3.0

git clone https://github.com/ManamiMayoki/JUAS_Adventure_Fest_3.0.git .
git checkout production

# Copy and edit production environment variables
cp .env.example .env
nano .env # Set your JWT_SECRET and MONGODB_URI

# Launch containers
docker compose -f docker-compose.prod.yml up -d --build

# Run database seeder inside the server container
docker compose -f docker-compose.prod.yml exec server npm run seed
```

### 4. Enable SSL with Let's Encrypt (Certbot)
```bash
sudo apt install -y certbot
sudo certbot certonly --webroot -w /opt/juas-adventure-fest-3.0/nginx -d your-domain.com
```

### 5. Configure GitHub Actions Secrets
In your GitHub repository under **Settings > Secrets and variables > Actions**, add:
- `AZURE_VM_HOST`: Public IP or DNS of the Azure VM.
- `AZURE_VM_USER`: SSH username (e.g., `azureuser`).
- `AZURE_SSH_KEY`: Private SSH Key corresponding to the VM's authorized keys.

Every push to `production` triggers `.github/workflows/deploy-production.yml` for automated zero-downtime deployment!

---

## ⚡ Concurrency Tuning (1,000+ Concurrent Users)

| Layer | Optimization Strategy |
| :--- | :--- |
| **Reverse Proxy (Nginx)** | `worker_connections 10240`, `epoll`, Gzip compression, rate limiting (`limit_req_zone 30r/s`). |
| **Node.js Cluster** | Multi-worker process pooling scaling across available Azure CPU cores via `server/src/cluster.js`. |
| **MongoDB Mongoose** | Connection pool `maxPoolSize: 50`, compound indexes on `registrationId`, `email`, and `transactionId`. |
| **Redis Cache** | Public stats and segment availability cached with 30-60s TTLs to eliminate database hits during registration bursts. |
| **Three.js WebGL** | `dpr={[1, 1.5]}` pixel ratio clamp, frustum culling, and low-poly procedural geometries to maintain steady 60 FPS on mobile. |

---

## 🛡️ License
Released under the **MIT License**. Created with passion for **Jahangirnagar University Adventure Society** & **JU Science Club**. Marufa
