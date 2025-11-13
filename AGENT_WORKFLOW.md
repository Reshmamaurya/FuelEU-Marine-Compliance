# 🧠 AI Agent Workflow Log

## Agents Utilized
- **ChatGPT (GPT-5)** — primary agent for architecture design, business logic formulation, and refactoring.
- **GitHub Copilot** — assisted with inline code completions, boilerplate setup, and minor syntax suggestions.
- **Cursor IDE Agent** — used for repetitive file generation, syntax correction, and refactoring automation.

---

## 🧩 Detailed Task Log

### 🧱 Task 1: Backend Architecture Setup
**Prompt:** “Design a modular backend architecture for the FuelEU Maritime compliance platform using Node.js, TypeScript, Express, Prisma, and PostgreSQL, structured with the hexagonal architecture pattern.”  
**Agent:** ChatGPT (GPT-5)  
**Output:** Created a complete folder hierarchy with `/core`, `/adapters`, `/ports`, and `/infrastructure` modules.  
**Manual Adjustments:** Updated relative import paths, configured `tsconfig-paths`, and optimized dependency setup.  
**Time Saved:** ≈ 2 hours of manual scaffolding.

---

### 🗄️ Task 2: Prisma Schema Design & Database Seeding
**Prompt:** “Create Prisma schema models for routes, ship_compliance, bank_entries, pools, and pool_members, including realistic seed data matching FuelEU specifications.”  
**Agent:** ChatGPT  
**Output:** Generated a well-structured `schema.prisma` file and a functional `prisma/seed.ts` script.  
**Manual Adjustments:** Fixed numeric type mismatches (`Float` vs `Decimal`), ensured referential integrity, and wrapped seeding in transactions.  
**Validation:** Verified data correctness via Prisma Studio (`npx prisma studio`).  
**Time Saved:** ≈ 1.5 hours.

---

### ⚙️ Task 3: Use-Case Layer Implementation
**Prompt:** “Implement domain-level use cases — CalculateCBUseCase, CompareRoutesUseCase, BankSurplusUseCase, ApplyBankedUseCase, and CreatePoolUseCase — using the business rules from the FuelEU Maritime regulation.”  
**Agent:** ChatGPT  
**Output:** Cleanly separated use-case logic with constants for `TARGET_2025` and `ENERGY_CONVERSION`.  
**Manual Edits:** Added precision handling, compliance threshold (`89.3368`), and immutability safeguards.  
**Testing:** Verified via Vitest.  
**Time Saved:** ≈ 3 hours.

---

### 🌐 Task 4: Express HTTP Controllers
**Prompt:** “Generate REST endpoints for /routes, /compliance, /banking, and /pools, each mapped to their respective use cases.”  
**Agent:** ChatGPT  
**Output:** Produced modular controller files and an entry-point `server.ts`.  
**Manual Adjustments:** Changed empty responses from status 204 → 200 with JSON for frontend compatibility.  
**Time Saved:** ≈ 1 hour.

---

### 📊 Task 5: Frontend Compare Tab + Visualization
**Prompt:** “Develop a React component (CompareTab) that fetches baseline and comparison route data from `/routes/comparison`, computes percentage differences, and visualizes them using Recharts.”  
**Agent:** ChatGPT  
**Output:** Functional component with hooks, API integration, and responsive bar chart layout.  
**Manual Adjustments:** Improved responsiveness, fine-tuned labels, and optimized state management.  
**Time Saved:** ≈ 1.5 hours.

---

### 🧾 Task 6: Validation Layer Integration
**Prompt:** “Integrate Zod validation for /banking/apply and ensure robust error handling for invalid payloads.”  
**Agent:** ChatGPT  
**Output:** Added Zod schema definitions and clean error normalization middleware.  
**Manual Adjustments:** Corrected `err.issues` to `err.errors` mismatch for Zod v3.  
**Time Saved:** ≈ 45 minutes.

---

### 🧪 Task 7: Domain Unit Testing
**Prompt:** “Write unit tests for calculateCB() and ensure that zero fuel consumption and boundary cases are handled safely.”  
**Agent:** ChatGPT  
**Output:** Created `calculateCB.spec.ts` with multiple test cases covering normal, edge, and zero scenarios.  
**Manual Adjustments:** Replaced `.toBe(0)` with `.toBeCloseTo(0)` for floating-point stability.  
**Validation:** All 10 tests passed via `npm run test`.  
**Time Saved:** ≈ 1 hour.

---

## ✅ Validation & Verification
- Verified all core logic with **Vitest** (unit + integration tests).
- Used **Supertest** to validate HTTP endpoints.
- Performed manual endpoint verification in **Postman** for `/routes` and `/routes/:id/baseline`.
- Checked seeded database state via **Prisma Studio** after baseline toggling.

---

## ⚠️ Agent Errors & Hallucinations
- ChatGPT initially proposed a non-existent `unsetAllBaselines()` Prisma method; replaced with a transaction-based update.
- Early confusion between `err.issues` vs `err.errors` in Zod required manual correction.
- Import alias misplacement (`@core/ports/RouteRepository`) fixed manually.

---

## 💡 Key Learnings & Best Practices
- Keep **domain logic pure** — no framework dependencies.
- Employ **Zod** for runtime safety and consistent input validation.
- Ensure **tests remain deterministic**, avoiding live DB calls in unit scope.
- Always return **JSON responses**, even when payloads are empty (improves frontend stability).
- AI agents accelerate scaffolding but require **human review** for accuracy and domain alignment.

---

🕒 **Total Time Saved through AI Assistance:** ~11–12 hours across backend and frontend modules.
