import { RefreshCw, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";

type ApiStatus = "checking" | "connected" | "unreachable";

const Topbar = () => {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();
    const timer = setInterval(update, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // Real check: does the FastAPI backend actually respond right now?
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

  const refresh = () => window.location.reload();

  const statusColor =
    status === "connected"
      ? "#10B981"
      : status === "unreachable"
      ? "#F43F5E"
      : "#6B7685";

  const statusLabel =
    status === "connected"
      ? "Live"
      : status === "unreachable"
      ? "Offline"
      : "Checking";

  return (
    <header className="h-16 bg-[#0A0E14] border-b border-[#1E2530] flex items-center justify-end px-6">

      <div className="flex items-center gap-3">

        {/* Live backend status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#1E2530] bg-[#12161F]">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-xs font-medium" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>

        {/* Time range indicator - static label, mirrors the source data
            (pipeline runs periodically, this is not a live clock claim) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#1E2530] bg-[#12161F] text-xs text-[#6B7685]">
          <span>{time}</span>
          <ChevronDown size={12} />
        </div>

        {/* Refresh */}
        <button
          onClick={refresh}
          className="w-8 h-8 rounded-md bg-[#12161F] border border-[#1E2530] hover:border-[#2A3241] transition flex items-center justify-center text-[#6B7685] hover:text-[#E5E9F0]"
          title="Refresh dashboard data"
        >
          <RefreshCw size={14} />
        </button>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#1E2530]">
          <div className="w-7 h-7 rounded-md bg-[#1E2530] flex items-center justify-center text-xs font-semibold text-[#E5E9F0]">
            RM
          </div>
          <div>
            <p className="text-xs font-medium text-[#E5E9F0] leading-tight">Rohit</p>
            <p className="text-[10px] text-[#6B7685] leading-tight">Data Analyst</p>
          </div>
        </div>

      </div>

    </header>
  );
};

export default Topbar;
