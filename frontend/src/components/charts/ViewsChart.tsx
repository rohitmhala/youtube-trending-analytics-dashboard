import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { ACCENT_BLUE, ACCENT_AMBER, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";

type Trend = {
  trending_date_parsed: string;
  total_views: number;
  total_likes: number;
};

const ViewsChart = () => {
  const [data, setData] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/views-trend?region=${filters.region}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters.region]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full">

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Views &amp; Likes Trend
        </h2>
      </div>

      {loading ? (
        <div className="h-[320px] flex items-center justify-center text-[#6B7685] text-sm">
          Loading...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="trending_date_parsed"
              tick={{ fill: AXIS_COLOR, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: GRID_COLOR }}
            />

            <YAxis
              tickFormatter={compactNumber}
              tick={{ fill: AXIS_COLOR, fontSize: 11 }}
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
              labelStyle={{ color: "#E5E9F0" }}
              formatter={(value, name) => [
  compactNumber(Number(value ?? 0)),
  String(name ?? ""),
]}
            />

            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#8B93A3" }}
              iconType="plainline"
            />

            <Line
              type="monotone"
              dataKey="total_views"
              name="Views"
              stroke={ACCENT_BLUE}
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="total_likes"
              name="Likes"
              stroke={ACCENT_AMBER}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
};

export default ViewsChart;
