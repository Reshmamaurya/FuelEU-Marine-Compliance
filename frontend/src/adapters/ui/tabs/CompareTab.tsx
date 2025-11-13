// import { useEffect, useState } from "react";
// import { apiGet } from "../../infrastructure/api/client";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function CompareTab() {
//   const [data, setData] = useState<any>({ baseline: null, comparisons: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     apiGet("/routes/comparison")
//       .then((res) => {
//         setData(res);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to load comparison data");
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p className="text-gray-400">Loading comparison data...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   if (!data.baseline) {
//     return <p className="text-gray-400">No baseline route set.</p>;
//   }

//   const chartData = data.comparisons.map((c: any) => ({
//     routeId: c.route.routeId,
//     GHG: c.route.ghgIntensity,
//   }));

//   return (
//     <div className="p-6 text-gray-200 bg-gray-900 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-white">GHG Comparison</h2>

//       <div className="mb-6">
//         <p>
//           Baseline:{" "}
//           <strong className="text-blue-400">{data.baseline.routeId}</strong> (
//           {data.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ)
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
//           <thead className="bg-gray-800 text-gray-300">
//             <tr>
//               <th className="py-2 px-3 text-left">Route ID</th>
//               <th className="py-2 px-3 text-left">GHG Intensity</th>
//               <th className="py-2 px-3 text-left">% Difference</th>
//               <th className="py-2 px-3 text-left">Compliant</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.comparisons.map((c: any) => (
//               <tr
//                 key={c.route.routeId}
//                 className="border-t border-gray-800 hover:bg-gray-800/40"
//               >
//                 <td className="py-2 px-3">{c.route.routeId}</td>
//                 <td className="py-2 px-3">{c.route.ghgIntensity.toFixed(2)}</td>
//                 <td
//                   className={`py-2 px-3 ${
//                     c.percentDiff < 0 ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   {c.percentDiff.toFixed(2)}%
//                 </td>
//                 <td className="py-2 px-3">
//                   {c.compliant ? "✅" : "❌"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Chart Section */}
//       {data.comparisons.length > 0 && (
//         <div className="mt-10 bg-gray-800 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold mb-3 text-gray-200">
//             GHG Intensity Comparison (Bar Chart)
//           </h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis dataKey="routeId" stroke="#cbd5e1" />
//               <YAxis stroke="#cbd5e1" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#1f2937",
//                   border: "none",
//                   color: "#f3f4f6",
//                 }}
//               />
//               <Legend />
//               <Bar
//                 dataKey="GHG"
//                 fill="#60a5fa"
//                 name="GHG (gCO₂e/MJ)"
//                 label={{ position: "top", fill: "#e2e8f0" }}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { apiGet } from "../../infrastructure/api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CompareTab() {
  const [data, setData] = useState<any>({ baseline: null, comparisons: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet("/routes/comparison")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load comparison data");
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading comparison data...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );

  if (!data.baseline) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No baseline route set.
      </div>
    );
  }

  const chartData = data.comparisons.map((c: any) => ({
    routeId: c.route.routeId,
    GHG: c.route.ghgIntensity,
  }));

  return (
    <div className="p-8 bg-gray-900 text-gray-200 rounded-xl shadow-lg space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">GHG Route Comparison</h2>

        <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-inner">
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Baseline Route:</span>{" "}
            <strong className="text-blue-400">{data.baseline.routeId}</strong>
          </p>
          <p className="text-sm text-gray-300">
            GHG Intensity:{" "}
            <strong className="text-green-400">
              {data.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
            </strong>
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="py-3 px-4">Route ID</th>
                <th className="py-3 px-4">GHG Intensity</th>
                <th className="py-3 px-4">% Difference</th>
                <th className="py-3 px-4 text-center">Compliant</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisons.map((c: any, i: number) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-100">
                    {c.route.routeId}
                  </td>
                  <td className="py-3 px-4">
                    {c.route.ghgIntensity.toFixed(2)}
                  </td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      c.percentDiff < 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {c.percentDiff.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center text-xl">
                    {c.compliant ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      {data.comparisons.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            GHG Intensity Comparison
          </h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="routeId" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  color: "#f3f4f6",
                }}
              />
              <Legend />
              <Bar
                dataKey="GHG"
                fill="#60a5fa"
                name="GHG (gCO₂e/MJ)"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fill: "#e2e8f0" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
