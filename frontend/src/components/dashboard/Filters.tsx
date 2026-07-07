import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useFilters } from "../../context/FilterContext";
import api from "../../services/api";

const REGION_LABELS: Record<string, string> = {
  us: "United States",
  gb: "United Kingdom",
  ca: "Canada",
  de: "Germany",
  fr: "France",
  in: "India",
  jp: "Japan",
  kr: "South Korea",
  mx: "Mexico",
  ru: "Russia",
};

const Filters = () => {
  const { filters, setFilters } = useFilters();
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await api.get("/regions");
        setRegions(res.data.map((r: { region: string }) => r.region));
      } catch (err) {
        console.error("Failed to load regions:", err);
      }
    };

    loadRegions();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6B7685] uppercase tracking-wide">
        Region
      </span>

      <div className="relative">
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="appearance-none bg-[#12161F] border border-[#1E2530] rounded-md pl-3 pr-8 py-1.5 text-sm text-[#E5E9F0] outline-none hover:border-[#2A3241] focus:border-[#3B82F6] transition cursor-pointer"
        >
          <option value="ALL">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region.toLowerCase()}>
              {REGION_LABELS[region.toLowerCase()] || region.toUpperCase()}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7685] pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Filters;
