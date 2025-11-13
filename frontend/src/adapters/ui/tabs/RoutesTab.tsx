// import { useEffect, useState } from "react";
// import { apiGet, apiPost } from "../../infrastructure/api/client";

// export default function RoutesTab() {
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchRoutes = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const data = await apiGet("/routes", filters);
//       setRoutes(data);
//     } catch (err: any) {
//       setError(err.message || "Failed to load routes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoutes();
//   }, [filters]);

//   async function setBaseline(routeId: string) {
//     try {
//       setLoading(true);
//       await apiPost(`/routes/${routeId}/baseline`);
//       fetchRoutes();
//     } catch (err: any) {
//       setError(err.message || "Failed to set baseline");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Routes</h2>

//       <div className="flex flex-wrap gap-4 mb-4">
//         <input
//           className="bg-gray-800 p-2 rounded"
//           placeholder="Vessel Type"
//           onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
//         />
//         <input
//           className="bg-gray-800 p-2 rounded"
//           placeholder="Fuel Type"
//           onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
//         />
//         <input
//           className="bg-gray-800 p-2 rounded"
//           placeholder="Year"
//           type="number"
//           onChange={(e) => setFilters({ ...filters, year: e.target.value })}
//         />
//       </div>

//       {loading && <p className="text-blue-400 mb-2">Loading routes…</p>}
//       {error && <p className="text-red-400 mb-2">{error}</p>}

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse border border-gray-700 text-sm">
//           <thead className="bg-gray-800">
//             <tr>
//               <th className="p-2 border border-gray-700">Route ID</th>
//               <th>Vessel</th>
//               <th>Fuel</th>
//               <th>Year</th>
//               <th>GHG</th>
//               <th>Fuel (t)</th>
//               <th>Distance (km)</th>
//               <th>Baseline</th>
//             </tr>
//           </thead>
//           <tbody>
//             {routes.map((r) => (
//               <tr key={r.routeId} className="text-center border border-gray-800">
//                 <td>{r.routeId}</td>
//                 <td>{r.vesselType}</td>
//                 <td>{r.fuelType}</td>
//                 <td>{r.year}</td>
//                 <td>{r.ghgIntensity}</td>
//                 <td>{r.fuelConsumption}</td>
//                 <td>{r.distance}</td>
//                 <td>
//                   {r.isBaseline ? (
//                     <span className="text-green-400 font-bold">✔</span>
//                   ) : (
//                     <button
//                       onClick={() => setBaseline(r.routeId)}
//                       disabled={loading}
//                       className={`px-3 py-1 rounded ${
//                         loading
//                           ? "bg-gray-600 cursor-not-allowed"
//                           : "bg-blue-500 hover:bg-blue-600"
//                       }`}
//                     >
//                       {loading ? "Processing..." : "Set Baseline"}
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../infrastructure/api/client";
import {
  FunnelIcon,
  RocketLaunchIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/routes", filters);
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [filters]);

  async function setBaseline(routeId: string) {
    try {
      setLoading(true);
      await apiPost(`/routes/${routeId}/baseline`);
      fetchRoutes();
    } catch (err: any) {
      setError(err.message || "Failed to set baseline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* 🌊 Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <RocketLaunchIcon className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Routes Overview
          </h2>
        </div>
        <div className="text-gray-400 text-sm italic">
          Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 🎛️ Filters Section */}
      <div className="bg-gray-800/60 border border-gray-700 p-5 rounded-xl shadow-lg mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-300 font-medium">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-400" />
          <span>Filter Routes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="bg-gray-900/80 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Vessel Type"
            onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })}
          />
          <input
            className="bg-gray-900/80 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Fuel Type"
            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          />
          <input
            className="bg-gray-900/80 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Year"
            type="number"
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
        </div>
      </div>

      {/* 🔁 Loading & Error */}
      {loading && (
        <p className="text-blue-400 flex items-center gap-2 mb-3">
          <FunnelIcon className="w-4 h-4 animate-spin" /> Loading routes…
        </p>
      )}
      {error && <p className="text-red-400 mb-3">{error}</p>}

      {/* 📊 Routes Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-md">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-gray-800/80 uppercase text-gray-400 text-xs">
            <tr>
              <th className="p-3 text-left">Route ID</th>
              <th className="p-3 text-left">Vessel</th>
              <th className="p-3 text-left">Fuel</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">GHG</th>
              <th className="p-3 text-left">Fuel (t)</th>
              <th className="p-3 text-left">Distance (km)</th>
              <th className="p-3 text-center">Baseline</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No routes found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              routes.map((r) => (
                <tr
                  key={r.routeId}
                  className="border-t border-gray-700 hover:bg-gray-800/60 transition-colors"
                >
                  <td className="p-3 font-medium">{r.routeId}</td>
                  <td className="p-3">{r.vesselType}</td>
                  <td className="p-3">{r.fuelType}</td>
                  <td className="p-3">{r.year}</td>
                  <td className="p-3 text-blue-300">{r.ghgIntensity}</td>
                  <td className="p-3">{r.fuelConsumption}</td>
                  <td className="p-3">{r.distance}</td>
                  <td className="p-3 text-center">
                    {r.isBaseline ? (
                      <span className="inline-flex items-center gap-1 bg-green-600/20 text-green-400 px-2 py-1 rounded-lg text-xs font-semibold">
                        <CheckCircleIcon className="w-4 h-4" /> Baseline
                      </span>
                    ) : (
                      <button
                        onClick={() => setBaseline(r.routeId)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          loading
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
                        }`}
                      >
                        {loading ? "..." : "Set Baseline"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
