import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { CATEGORY_PALETTE } from "../../theme/colors";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Category = {
  category: string;
  total_views: number;
  view_share_pct: number;
};

const CategoryChart = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/category-distribution?region=${filters.region}`);
        setData(res.data.map((row: Category) => ({ ...row, category: cleanText(row.category) })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters.region]);

  const totalViews = data.reduce((sum, item) => sum + Number(item.total_views), 0);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full">

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Category Distribution
        </h2>
      </div>

      {loading ? (
        <div className="h-[320px] flex items-center justify-center text-[#6B7685] text-sm">
          Loading...
        </div>
      ) : (
        <div className="flex flex-col items-center">

          <div className="w-full h-[190px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total_views"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="#0A0E14"
                  strokeWidth={2}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [compactNumber(Number(value ?? 0)), "Views"]}
                  contentStyle={{
                    background: "#12161F",
                    border: "1px solid #1E2530",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-[#6B7685] uppercase tracking-wide">Total</span>
              <span className="text-lg font-semibold text-[#E5E9F0] tabular-nums">
                {compactNumber(totalViews)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-1.5 mt-3">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length] }}
                  />
                  <span className="text-[#8B93A3] truncate">{item.category}</span>
                </div>
                <span className="text-[#E5E9F0] font-medium tabular-nums flex-shrink-0 ml-2">
                  {item.view_share_pct}%
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default CategoryChart;
