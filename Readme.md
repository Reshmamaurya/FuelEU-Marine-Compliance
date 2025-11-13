#  FuelEU Maritime — Full-Stack Compliance Platform

> **Empowering sustainable maritime operations with AI-assisted engineering and clean architecture.**

A full-stack TypeScript platform implementing **FuelEU Maritime Regulation (EU) 2023/1805**, enabling compliance validation, route comparison, carbon-banking, and pooling across fleets — built under a **strict Hexagonal (Ports & Adapters)** architecture.

Developed with precision, testability, and regulatory accuracy at its core.

---

## Project Vision

The **FuelEU Maritime Regulation** demands greener ships through yearly GHG intensity reductions and trading mechanisms like *banking* and *pooling*.  

This system automates those computations and enables ship operators to:

-  Compare GHG performance per route  
-  Calculate compliance balance (CB) automatically  
-  Bank surplus or apply to deficit years  
-  Form emission pools to offset deficits collaboratively  

---

##  Architecture Overview — Clean, Testable, Scalable

backend/
src/
core/
domain/ # Entities, Value Objects, Business Rules (Framework-free)
application/ # Use Cases orchestrating domain logic
ports/ # Abstractions for persistence (Dependency Inversion)
adapters/
inbound/express # HTTP Controllers (Express)
outbound/prisma # Database Repositories (Prisma)
frontend/
src/
core/ # Domain logic, View models
adapters/
ui/ # React Components (Presentation)
infrastructure/ # API Client (Implements Ports)

> **Key Idea:**  
> The **core never imports frameworks** (Express, React, Prisma).  
> Adapters implement interfaces defined by the domain, ensuring **total independence and portability**.

---


>  **Hexagonal Principle:**  
> The `core` layer **never imports** Express, React, or Prisma.  
> Adapters depend *on the domain*, not the other way around — ensuring **total independence and portability**.

## Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18 + TypeScript, TailwindCSS, Vite, Recharts |
| **Backend** | Node.js + TypeScript, Express 5, Prisma ORM, PostgreSQL |
| **Validation** | Zod |
| **Testing** | Vitest + Supertest |
| **Architecture** | Clean / Hexagonal / Ports & Adapters |
| **Docs** | Markdown + Swagger-ready structure |

---

### Environment Variables
Create your `.env` file by copying the example:
cp .env.example .env
---

 Quick Start Guide

🛠 Backend Setup
cd fuel-eu-backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
Backend runs at  http://localhost:4000

Frontend Setup
cd frontend
npm install
npm run dev
Frontend runs at  http://localhost:5173

🧮 Core Formulae (Annex IV, Regulation EU 2023/1805)
Target 2025 GHG Intensity: 89.3368 gCO₂e / MJ
Energy Conversion: 41,000 MJ / tonne
ComplianceBalance = (Target - ActualGHG) * (FuelConsumption * 41000)
Pooling Logic (FuelEU Article 21)
Constraint	Description
Σ adjustedCB ≥ 0	Total pool must remain non-negative
CB < 0 → cb_after ≥ cb_before	Deficit ships can’t worsen
CB > 0 → cb_after ≥ 0	Surplus ships can’t go negative



🌐 API Endpoints Summary
Method	Endpoint	Description
GET	/routes	List all routes (with filters)
POST	/routes/:id/baseline	Set a baseline route
GET	/routes/comparison	Compare routes vs. baseline
GET	/compliance/cb	Compute & store CB
GET	/compliance/adjusted-cb	Return CB after banking
GET	/banking/records	View banked entries
POST	/banking/bank	Bank positive CB
POST	/banking/apply	Apply banked surplus
POST	/pools	Create compliance pool

🧪 Testing
npm run test
npx vitest run --coverage

✅ Expected Result:
✓ 4 test files | 10 tests | 100% passed
🧾 Environment Variables
Create .env inside fuel-eu-backend/:
DATABASE_URL="postgresql://user:password@localhost:5432/fueleu"
PORT=4000


🖥️ Frontend Overview
Tab	Description
Routes	Displays all seeded routes; allows setting baseline
Compare	Shows GHG intensity differences vs. baseline + charts
Banking	View, bank, and apply compliance balances
Pooling	Create emission pools and validate with color indicators

🧠 Visuals:

Interactive Recharts bar charts in “Compare” tab

Dynamic pool validation indicator (green/red)

API error-handling for user clarity

🧭 Domain-Centric Design
The Domain Layer defines pure logic for:

Route Entity

Compliance Balance

Banking Entry

Pooling Mechanism

No external library is imported here.
Every external dependency is abstracted behind a Port (interface).

⚖️ Regulation Alignment
This implementation follows FuelEU Maritime Regulation (EU) 2023/1805,
Annex IV (GHG Calculation Methodology) and Articles 20–21 (Banking & Pooling).
Validated using reference material: ESSF SAPS WS1 — Calculation Methodologies, May 2025.

"Compliance balance calculations follow Annex IV, §1.3.1;
pooling logic aligns with Article 21, §4.5.1."

📘 Documentation Summary
File	Description
AGENT_WORKFLOW.md	Detailed AI-agent collaboration log
README.md	Technical overview & setup guide
REFLECTION.md	Learning outcomes & efficiency analysis

🧑‍💻 Author
Reshma Maurya
B.Tech — Computer Science and  Engineering , IIT Jodhpur





