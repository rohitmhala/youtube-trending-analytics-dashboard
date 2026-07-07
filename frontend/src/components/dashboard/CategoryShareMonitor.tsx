import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { CATEGORY_PALETTE } from "../../theme/colors";
import { cleanText } from "../../utils/cleanText";

// Real column from category_analytics: view_share_pct is already a
// pre-computed percentage in the Gold layer - the bar length below is
// that real value, not an estimated one.
type Category = {
  category: string;
  total_views: number;
  view_share_pct: number;
};

const CategoryShareMonitor = () => {
  const [data, setData] = useState<Category[]>([]);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/category-distribution?region=${filters.region}`);
        setData(res.data.map((row: Category) => ({ ...row, category: cleanText(row.category) })));
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-1">
        Category View Share
      </h2>
      <p className="text-xs text-[#6B7685] mb-4">% of total views by category</p>

      <div className="space-y-3.5">
        {data.map((item, index) => (
          <div key={item.category}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#C7CCD4] truncate pr-2">{item.category}</span>
              <span className="text-[#8B93A3] tabular-nums flex-shrink-0">
                {item.view_share_pct}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1E2530] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, item.view_share_pct)}%`,
                  backgroundColor: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
                }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-[#5B6472] text-sm">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryShareMonitor;
