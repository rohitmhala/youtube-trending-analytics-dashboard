import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { ACCENT_VIOLET, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";
import { cleanText } from "../../utils/cleanText";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Category = {
  category: string;
  avg_engagement_rate: number;
  total_views: number;
  video_count: number;
};

const CategoryPerformanceChart = () => {
  const [data, setData] = useState<Category[]>([]);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/category-performance?region=${filters.region}`);
        const cleaned = res.data
          .slice(0, 8)
          .map((row: Category) => ({ ...row, category: cleanText(row.category) }));
        setData(cleaned);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-4">
        Category Performance (by Engagement)
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" horizontal={false} />

          <XAxis
            type="number"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={(v) => `${v}%`}
          />

          <YAxis
            type="category"
            dataKey="category"
            stroke={AXIS_COLOR}
            fontSize={11}
            width={110}
          />

          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Avg Engagement"]}
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />

          <Bar dataKey="avg_engagement_rate" fill={ACCENT_VIOLET} radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPerformanceChart;
