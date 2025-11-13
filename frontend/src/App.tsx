// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import RoutesTab from "./adapters/ui/tabs/RoutesTab";
// import CompareTab from "./adapters/ui/tabs/CompareTab";
// import BankingTab from "./adapters/ui/tabs/BankingTab";
// import PoolingTab from "./adapters/ui/tabs/PoolingTab";

// export default function App() {
//   return (
//     <Router>
//       <div className="min-h-screen flex flex-col bg-gray-900 text-white">
//         {/* ✅ Responsive Navigation */}
//         <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 py-3 bg-gray-800 text-sm sm:text-base shadow-md">
//           <Link className="hover:text-blue-400 transition-colors" to="/">
//             Routes
//           </Link>
//           <Link className="hover:text-blue-400 transition-colors" to="/compare">
//             Compare
//           </Link>
//           <Link className="hover:text-blue-400 transition-colors" to="/banking">
//             Banking
//           </Link>
//           <Link className="hover:text-blue-400 transition-colors" to="/pooling">
//             Pooling
//           </Link>
//         </nav>

//         {/* ✅ Main Content Area */}
//         <main className="flex-1 p-6 sm:p-8 overflow-x-auto">
//           <Routes>
//             <Route path="/" element={<RoutesTab />} />
//             <Route path="/compare" element={<CompareTab />} />
//             <Route path="/banking" element={<BankingTab />} />
//             <Route path="/pooling" element={<PoolingTab />} />
//           </Routes>
//         </main>

//         {/* ✅ Footer */}
//         <footer className="bg-gray-800 text-center py-3 text-xs text-gray-400 border-t border-gray-700">
//           FuelEU Maritime Dashboard © {new Date().getFullYear()}
//         </footer>
//       </div>
//     </Router>
//   );
// }


import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import RoutesTab from "./adapters/ui/tabs/RoutesTab";
import CompareTab from "./adapters/ui/tabs/CompareTab";
import BankingTab from "./adapters/ui/tabs/BankingTab";
import PoolingTab from "./adapters/ui/tabs/PoolingTab";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#021f3f] via-[#033b63] to-[#055e8c] text-white">
        {/* 🌐 Top Navigation Bar */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-blue-700 bg-[#021f3f]/90 backdrop-blur-md shadow-md">
          {/* 🛳️ Project Name */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-[#00b4d8]">
            FuelEU Maritime Dashboard
          </h1>

          {/* 🧭 Navigation Links */}
          <nav className="flex gap-6 sm:gap-10 text-sm sm:text-base font-medium">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-all duration-200 hover:text-[#00b4d8] ${
                  isActive ? "text-[#00b4d8] border-b-2 border-[#00b4d8]" : "text-gray-300"
                }`
              }
            >
              Routes
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `transition-all duration-200 hover:text-[#00b4d8] ${
                  isActive ? "text-[#00b4d8] border-b-2 border-[#00b4d8]" : "text-gray-300"
                }`
              }
            >
              Compare
            </NavLink>
            <NavLink
              to="/banking"
              className={({ isActive }) =>
                `transition-all duration-200 hover:text-[#00b4d8] ${
                  isActive ? "text-[#00b4d8] border-b-2 border-[#00b4d8]" : "text-gray-300"
                }`
              }
            >
              Banking
            </NavLink>
            <NavLink
              to="/pooling"
              className={({ isActive }) =>
                `transition-all duration-200 hover:text-[#00b4d8] ${
                  isActive ? "text-[#00b4d8] border-b-2 border-[#00b4d8]" : "text-gray-300"
                }`
              }
            >
              Pooling
            </NavLink>
          </nav>
        </header>

        {/* 🧩 Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 overflow-x-auto">
          <Routes>
            <Route path="/" element={<RoutesTab />} />
            <Route path="/compare" element={<CompareTab />} />
            <Route path="/banking" element={<BankingTab />} />
            <Route path="/pooling" element={<PoolingTab />} />
          </Routes>
        </main>

        {/* ⚓ Footer */}
        <footer className="bg-[#021f3f]/90 border-t border-blue-700 text-center py-3 text-xs text-gray-400">
          © {new Date().getFullYear()} FuelEU Maritime Compliance | Designed with 🌊
        </footer>
      </div>
    </Router>
  );
}
