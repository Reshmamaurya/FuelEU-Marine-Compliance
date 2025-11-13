import { useState } from "react";
import { apiGet, apiPost } from "../../infrastructure/api/client";

export default function PoolingTab() {
  const [year, setYear] = useState("");
  const [ships, setShips] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [poolResult, setPoolResult] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testShips = ["S1", "S2", "S3"];

  async function loadAdjusted() {
    try {
      setLoading(true);
      setError("");
      const adjusted: any[] = [];
      for (const id of testShips) {
        const res = await apiGet("/compliance/adjusted-cb", { shipId: id, year });
        adjusted.push(res);
      }
      setShips(adjusted);
      setMembers(adjusted.map(a => ({ shipId: a.shipId, adjustedCB: a.cbAfter })));
    } catch (err: any) {
      setError(err.message || "Failed to load adjusted CBs");
    } finally {
      setLoading(false);
    }
  }

  async function createPool() {
    try {
      setLoading(true);
      const data = await apiPost("/pools", { year: Number(year), members });
      setPoolResult(data.allocated);
      setMessage("Pool created successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to create pool");
    } finally {
      setLoading(false);
    }
  }

  const totalSum = members.reduce((s, m) => s + (m.adjustedCB || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pooling</h2>

      <div className="flex gap-4 mb-4">
        <input
          className="bg-gray-800 p-2 rounded"
          placeholder="Year"
          type="number"
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          onClick={loadAdjusted}
          disabled={loading}
          className={`px-4 py-2 rounded ${loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Loading…" : "Load Adjusted CBs"}
        </button>
      </div>

      {loading && <p className="text-blue-400">Processing…</p>}
      {error && <p className="text-red-400">{error}</p>}
      {message && <p className="text-green-400">{message}</p>}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-700 text-sm mb-4">
          <thead className="bg-gray-800">
            <tr>
              <th>Ship ID</th>
              <th>CB Before</th>
              <th>CB After</th>
            </tr>
          </thead>
          <tbody>
            {ships.map((s) => (
              <tr key={s.shipId} className="text-center border border-gray-800">
                <td>{s.shipId}</td>
                <td>{s.cbBefore}</td>
                <td>{s.cbAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        <b>Total CB Sum:</b>{" "}
        <span className={totalSum >= 0 ? "text-green-400" : "text-red-400"}>
          {totalSum.toFixed(2)}
        </span>
      </p>

      <button
        onClick={createPool}
        disabled={totalSum < 0 || loading}
        className={`mt-4 px-4 py-2 rounded ${loading ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"}`}
      >
        {loading ? "Creating…" : "Create Pool"}
      </button>

      {poolResult.length > 0 && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Pool Allocation Result</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th>Ship ID</th>
                  <th>CB Before</th>
                  <th>CB After</th>
                </tr>
              </thead>
              <tbody>
                {poolResult.map((m: any) => (
                  <tr key={m.shipId} className="text-center border border-gray-800">
                    <td>{m.shipId}</td>
                    <td>{m.cbBefore}</td>
                    <td>{m.cbAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
