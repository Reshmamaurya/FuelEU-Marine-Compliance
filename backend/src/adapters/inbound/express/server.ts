import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { z, ZodError } from "zod";
import "dotenv/config";


import { RouteRepositoryPrisma } from "@adapters/outbound/prisma/RouteRepositoryPrisma";
import { ComplianceRepositoryPrisma } from "@adapters/outbound/prisma/ComplianceRepositoryPrisma";
import { BankingRepositoryPrisma } from "@adapters/outbound/prisma/BankingRepositoryPrisma";
import { PoolRepositoryPrisma } from "@adapters/outbound/prisma/PoolRepositoryPrisma";

import { CalculateCBUseCase } from "@core/application/usecases/CalculateCBUseCase";
import { CompareRoutesUseCase } from "@core/application/usecases/CompareRoutesUseCase";
import { SetBaselineUseCase } from "@core/application/usecases/SetBaselineUseCase";
import { BankSurplusUseCase } from "@core/application/usecases/BankSurplusUseCase";
import { ApplyBankedUseCase } from "@core/application/usecases/ApplyBankedUseCase";
import { CreatePoolUseCase } from "@core/application/usecases/CreatePoolUseCase";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Instantiate repositories
const routeRepo = new RouteRepositoryPrisma();
const complianceRepo = new ComplianceRepositoryPrisma();
const bankingRepo = new BankingRepositoryPrisma();
const poolRepo = new PoolRepositoryPrisma();

// Instantiate use-cases
const calculateCB = new CalculateCBUseCase(complianceRepo);
const compareRoutes = new CompareRoutesUseCase(routeRepo);
const setBaseline = new SetBaselineUseCase(routeRepo);
const bankSurplus = new BankSurplusUseCase(bankingRepo, complianceRepo);
const applyBanked = new ApplyBankedUseCase(bankingRepo);
const createPool = new CreatePoolUseCase(poolRepo);

/**
 * ROUTES MODULE
 */
app.get("/", (_, res) => {
  res.send("FuelEU Maritime API running 🚢");
});

app.get("/routes", async (req, res) => {
  try {
    const { vesselType, fuelType, year } = req.query;
    const routes = await routeRepo.findAll({
      vesselType: vesselType as string,
      fuelType: fuelType as string,
      year: year ? Number(year) : undefined,
    });
    res.json(routes);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch routes", error: err.message });
  }
});

app.post("/routes/:id/baseline", async (req, res) => {
  try {
    const routeId = req.params.id;
    await setBaseline.execute(routeId);
    return res.status(200).json({ success: true, baseline: routeId });
  } catch (err: any) {
    console.error("❌ Error setting baseline:", err);
    res.status(400).json({ message: err.message });
  }
});

app.get("/routes/comparison", async (req, res) => {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const result = await compareRoutes.execute(year);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to compare routes", error: err.message });
  }
});

/**
 * COMPLIANCE MODULE
 */
app.get("/compliance/cb", async (req, res) => {
  try {
    const { shipId, year, actualGHG, fuelConsumption } = req.query;
    if (!shipId || !year || !actualGHG || !fuelConsumption) {
      return res.status(400).json({ message: "Missing required params" });
    }

    const record = await calculateCB.execute(
      String(shipId),
      Number(year),
      Number(actualGHG),
      Number(fuelConsumption)
    );
    res.json(record);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/compliance/adjusted-cb", async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) return res.status(400).json({ message: "Missing params" });

    const compliance = await complianceRepo.findLatestCompliance(String(shipId), Number(year));
    const totalBanked = await bankingRepo.getBankedTotal(String(shipId), Number(year));
    const adjusted = (compliance?.cbGco2eq ?? 0) + totalBanked;

    res.json({
      shipId,
      year,
      cbBefore: compliance?.cbGco2eq ?? 0,
      banked: totalBanked,
      cbAfter: adjusted,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to compute adjusted CB", error: err.message });
  }
});

/**
 * BANKING MODULE
 */
app.get("/banking/records", async (req, res) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) return res.status(400).json({ message: "Missing params" });

    const entries = await bankingRepo.getBankEntries(String(shipId), Number(year));
    res.json(entries);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch banking records", error: err.message });
  }
});

app.post("/banking/bank", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;
    const entry = await bankSurplus.execute(shipId, year, Number(amount));
    res.json(entry);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ ZOD VALIDATION ADDED HERE
const applySchema = z.object({
  shipId: z.string().min(1, "Ship ID required"),
  year: z.number().min(2000),
  amount: z.number().positive("Amount must be > 0"),
});

app.post("/banking/apply", async (req, res) => {
  try {
    const data = applySchema.parse(req.body);
    const entry = await applyBanked.execute(data.shipId, data.year, data.amount);
    res.json(entry);
  } catch (err) {
    if (err instanceof ZodError) {
      const formatted = err.issues.map(issue => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ validationErrors: formatted });
    }

    const message = err instanceof Error ? err.message : "Unexpected server error";
    res.status(500).json({ message });
  }
});

/**
 * POOLING MODULE
 */
app.post("/pools", async (req, res) => {
  try {
    const { year, members } = req.body;
    if (!year || !Array.isArray(members))
      return res.status(400).json({ message: "Invalid input" });

    const result = await createPool.execute(Number(year), members);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

export default app;