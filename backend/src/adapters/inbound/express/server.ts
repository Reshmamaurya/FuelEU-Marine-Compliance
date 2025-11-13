import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

// --- Health Check ---
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// --- Example Route ---
app.get("/", (req: Request, res: Response) => {
  res.send("Fuel EU Maritime Backend is running!");
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
