import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  PlayCircle,
  Globe2,
  FolderKanban,
  Settings,
  CircleCheckBig,
  CircleX,
  Loader2,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import api from "../../services/api";

const menuItems = [
  { icon: LayoutDashboard, title: "Dashboard", path: "/" },
  { icon: ChartNoAxesCombined, title: "Analytics", path: "/analytics" },
  { icon: PlayCircle, title: "Channels", path: "/channels" },
  { icon: Globe2, title: "Regions", path: "/regions" },
  { icon: FolderKanban, title: "Categories", path: "/categories" },
  { icon: Settings, title: "Settings", path: "/settings" },
];

// The stack this app is actually built on - described, not claimed as
// individually live-monitored (only the API connection below is a real
// live check).
const STACK = ["AWS Glue", "Amazon Athena", "S3 Gold Layer", "FastAPI", "React"];

type ApiStatus = "checking" | "connected" | "unreachable";

const Sidebar = () => {
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get("/", { baseURL: api.defaults.baseURL?.replace("/api", "") });
        setStatus("connected");
      } catch {
        setStatus("unreachable");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-60 min-h-screen bg-[#0A0E14] border-r border-[#1E2530] flex flex-col">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1E2530]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#E11D48] flex items-center justify-center text-sm text-white">
            ▶
          </div>
          <div>
            <h1 className="text-[#E5E9F0] text-sm font-semibold leading-tight">
              YouTube Analytics
            </h1>
            <p className="text-[#6B7685] text-[11px] leading-tight">
              Data Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#6B7685] mb-3 px-2">
          Navigation
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-sm transition-colors ${
                  isActive
                    ? "bg-[#1E2530] text-[#E5E9F0] border-l-2 border-[#E11D48]"
                    : "text-[#6B7685] hover:bg-[#12161F] hover:text-[#E5E9F0] border-l-2 border-transparent"
                }`
              }
            >
              <Icon size={16} />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Architecture + live API status */}
      <div className="px-3 pb-4">
        <div className="rounded-md bg-[#12161F] border border-[#1E2530] p-4">

          <p className="text-[10px] uppercase tracking-widest text-[#6B7685] mb-3">
            Architecture
          </p>

          <div className="space-y-1.5 mb-4">
            {STACK.map((item) => (
              <div key={item} className="text-[#8B93A3] text-xs">
                {item}
              </div>
            ))}
          </div>

          <div className="border-t border-[#1E2530] pt-3 flex items-center gap-2">
            {status === "checking" && (
              <>
                <Loader2 size={13} className="animate-spin text-[#6B7685]" />
                <span className="text-xs text-[#6B7685]">Checking API...</span>
              </>
            )}

            {status === "connected" && (
              <>
                <CircleCheckBig size={13} className="text-[#10B981]" />
                <span className="text-xs text-[#10B981]">API Connected</span>
              </>
            )}

            {status === "unreachable" && (
              <>
                <CircleX size={13} className="text-[#F43F5E]" />
                <span className="text-xs text-[#F43F5E]">API Unreachable</span>
              </>
            )}
          </div>

        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
