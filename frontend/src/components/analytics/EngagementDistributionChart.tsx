import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { ACCENT_AMBER, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Engagement = {
  trending_date_parsed: string;
  avg_engagement_rate: number;
};

const EngagementDistributionChart = () => {
  const [data, setData] = useState<Engagement[]>([]);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/engagement-distribution?region=${filters.region}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-4">
        Engagement Trend
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="trending_date_parsed"
            stroke={AXIS_COLOR}
            tick={{ fontSize: 11 }}
            tickLine={false}
          />

          <YAxis
            stroke={AXIS_COLOR}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value ?? 0).toFixed(2)}%`, "Engagement"]}
          />

          <Bar dataKey="avg_engagement_rate" fill={ACCENT_AMBER} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementDistributionChart;
