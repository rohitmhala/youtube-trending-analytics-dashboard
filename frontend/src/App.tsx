import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Channels from "./pages/Channels/Channels";
import Regions from "./pages/Regions/Regions";
import Categories from "./pages/Categories/Categories";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0A0E14]">

        {/* Sidebar */}

        <Sidebar />

        {/* Main Content */}

        <main className="flex-1 overflow-y-auto">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/channels"
              element={<Channels />}
            />

            <Route
              path="/regions"
              element={<Regions />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;