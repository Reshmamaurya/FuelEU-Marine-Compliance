import request from "supertest";
import app from "../../src/adapters/inbound/express/server";

describe("Routes API", () => {
  it("GET /routes returns all seeded routes", async () => {
    const res = await request(app).get("/routes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("POST /routes/:id/baseline sets baseline", async () => {
    const res = await request(app).post("/routes/R001/baseline");
    expect([204, 200]).toContain(res.status);
  });
});
