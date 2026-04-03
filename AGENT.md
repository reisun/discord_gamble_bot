# AGENT.md
AI agent Repository Rules

This repository follows the **global AI agent environment and workflow policy**:

`~/workspace/.agent/AGENT.md`

If there is any conflict, **the rules in this file take precedence for this repository**.

---

## 0. Project Overview

- **Name**: what-to-build
- **Purpose**: Web service that suggests app ideas when users are undecided about what to build
- **Language**: TypeScript
- **Type**: Web Service (framework TBD)

---

## 1. Repository Scope

- Claude Code may operate **only within this repository**
- External repositories, submodules, or shared volumes require **human confirmation**

---

## 2. Docker Compose Rules (Repository-specific)

### 2.1 Allowed (no volume deletion)
- `docker compose up -d`
- `docker compose stop`
- `docker compose start`
- `docker compose restart`
- `docker compose ps`
- `docker compose logs`
- `docker compose build`
- `docker compose up -d --build`

### 2.2 Human confirmation required
- `docker compose down -v`
- Any volume / image removal
- Database reset or destructive migration

---

## 3. Ports and Network

- Ports must be bound to `127.0.0.1` unless explicitly approved
- Do not change port exposure without explaining the risk

---

## 4. Environment Variables

- `.env` files must NOT be committed
- Secrets must not appear in logs or output
- `.env.example` may be created using dummy values only

---

## 5. Git Rules (Repository-specific)

- Work on feature branches only
- Commit changes in small, reviewable units
- No force push without human approval

---

## 6. Pre-execution Protocol (Mandatory)

Before executing any command that changes state, Claude Code must present:

1. Purpose
2. Exact command
3. Impact scope (files / services / data loss)

---

## 7. Prohibited Actions (Reiteration)

- `sudo`
- Access to `/mnt/c`
- Destructive Docker operations without approval
- History rewriting without approval

---

End of repository-specific rules.
