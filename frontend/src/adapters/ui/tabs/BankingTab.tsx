import { useState } from "react";
import { apiGet, apiPost } from "../../infrastructure/api/client";

export default function BankingTab() {
  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState("");
  const [actualGHG, setActualGHG] = useState("");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [cbData, setCbData] = useState<any | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [bankAmount, setBankAmount] = useState("");
  const [applyAmount, setApplyAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculateCB() {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/compliance/cb", { shipId, year, actualGHG, fuelConsumption });
      setCbData(data);
      setMessage("Compliance balance calculated successfully.");
      loadRecords();
    } catch (err: any) {
      setError(err.message || "Failed to calculate CB");
    } finally {
      setLoading(false);
    }
  }

  async function loadRecords() {
    try {
      const data = await apiGet("/banking/records", { shipId, year });
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load records");
    }
  }

  async function bankSurplus() {
    try {
      setLoading(true);
      await apiPost("/banking/bank", { shipId, year: Number(year), amount: Number(bankAmount) });
      setMessage("Banked successfully!");
      loadRecords();
    } catch (err: any) {
      setError(err.message || "Failed to bank surplus");
    } finally {
      setLoading(false);
    }
  }

  async function applyBanked() {
    try {
      setLoading(true);
      await apiPost("/banking/apply", { shipId, year: Number(year), amount: Number(applyAmount) });
      setMessage("Applied successfully!");
      loadRecords();
    } catch (err: any) {
      setError(err.message || "Failed to apply balance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Banking</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input className="bg-gray-800 p-2 rounded" placeholder="Ship ID" onChange={(e) => setShipId(e.target.value)} />
        <input className="bg-gray-800 p-2 rounded" placeholder="Year" type="number" onChange={(e) => setYear(e.target.value)} />
        <input className="bg-gray-800 p-2 rounded" placeholder="Actual GHG (gCO₂e/MJ)" onChange={(e) => setActualGHG(e.target.value)} />
        <input className="bg-gray-800 p-2 rounded" placeholder="Fuel Consumption (tonnes)" onChange={(e) => setFuelConsumption(e.target.value)} />
      </div>

      <button
        onClick={calculateCB}
        disabled={loading}
        className={`px-4 py-2 rounded ${loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {loading ? "Calculating..." : "Calculate Compliance Balance"}
      </button>

      {loading && <p className="text-blue-400 mt-2">Processing...</p>}
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {message && <p className="text-green-400 mt-2">{message}</p>}

      {cbData && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Compliance Result</h3>
          <p><b>Ship:</b> {cbData.shipId}</p>
          <p><b>Year:</b> {cbData.year}</p>
          <p><b>Compliance Balance:</b> {cbData.cbGco2eq.toFixed(2)}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Bank Surplus</h3>
          <input
            className="bg-gray-700 p-2 rounded w-full mb-2"
            placeholder="Amount to bank"
            type="number"
            onChange={(e) => setBankAmount(e.target.value)}
          />
          <button
            onClick={bankSurplus}
            disabled={!cbData || cbData.cbGco2eq <= 0 || loading}
            className={`px-3 py-1 rounded ${loading ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Processing..." : "Bank Surplus"}
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Apply Banked</h3>
          <input
            className="bg-gray-700 p-2 rounded w-full mb-2"
            placeholder="Amount to apply"
            type="number"
            onChange={(e) => setApplyAmount(e.target.value)}
          />
          <button
            onClick={applyBanked}
            disabled={loading}
            className={`px-3 py-1 rounded ${loading ? "bg-gray-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
          >
            {loading ? "Processing..." : "Apply"}
          </button>
        </div>
      </div>

      <h3 className="mt-8 text-lg font-semibold">Banking History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border border-gray-700">Date</th>
              <th>Amount (gCO₂e)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="text-center border border-gray-800">
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>{r.amountGco2eq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

