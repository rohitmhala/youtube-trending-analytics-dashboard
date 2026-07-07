import { useEffect, useState } from "react";
import { Database, Server, Table2, Layers } from "lucide-react";
import api from "../../services/api";
import { ACCENT_BLUE, ACCENT_GREEN, ACCENT_VIOLET } from "../../theme/colors";

// Real values, read live from the backend's actual environment
// variables (backend/.env) - not hardcoded strings in the frontend.
type SystemInfo = {
  aws_region: string;
  athena_database: string;
  athena_workgroup: string;
  gold_tables: string[];
  architecture: string[];
};

const SystemInfo = () => {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/system-info");
        setInfo(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!info) {
    return (
      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-6 text-center text-sm text-[#6B7685]">
        Loading system info...
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} style={{ color: ACCENT_BLUE }} />
          <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
            Athena Connection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0A0E14] border border-[#1E2530] rounded-md p-3">
            <p className="text-[#6B7685] text-xs">AWS Region</p>
            <p className="text-[#E5E9F0] font-medium mt-1 text-sm">{info.aws_region}</p>
          </div>
          <div className="bg-[#0A0E14] border border-[#1E2530] rounded-md p-3">
            <p className="text-[#6B7685] text-xs">Athena Database</p>
            <p className="text-[#E5E9F0] font-medium mt-1 text-sm">{info.athena_database}</p>
          </div>
          <div className="bg-[#0A0E14] border border-[#1E2530] rounded-md p-3">
            <p className="text-[#6B7685] text-xs">Workgroup</p>
            <p className="text-[#E5E9F0] font-medium mt-1 text-sm">{info.athena_workgroup}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Table2 size={16} style={{ color: ACCENT_GREEN }} />
          <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
            Gold Layer Tables
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {info.gold_tables.map((table) => (
            <div
              key={table}
              className="bg-[#0A0E14] border border-[#1E2530] rounded-md p-3 flex items-center gap-2"
            >
              <Database size={15} style={{ color: ACCENT_GREEN }} />
              <span className="text-[#E5E9F0] font-mono text-xs">{table}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} style={{ color: ACCENT_VIOLET }} />
          <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
            Pipeline Architecture
          </h2>
        </div>

        <div className="space-y-2">
          {info.architecture.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 bg-[#0A0E14] border border-[#1E2530] rounded-md p-3"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ backgroundColor: "rgba(139,92,246,0.15)", color: ACCENT_VIOLET }}
              >
                {index + 1}
              </div>
              <span className="text-[#C7CCD4] text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SystemInfo;
