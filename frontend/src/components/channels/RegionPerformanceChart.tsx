import { useEffect, useState } from "react";
import api from "../../services/api";
import { compactNumber } from "../../utils/compactNumber";
import { ACCENT_CYAN, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Region = {
  region: string;
  total_views: number;
};

const RegionPerformanceChart = () => {
  const [data, setData] = useState<Region[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/region-performance");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-4">
        Views by Region
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" horizontal={false} />

          <XAxis
            type="number"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={compactNumber}
          />

          <YAxis
            dataKey="region"
            type="category"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={(v: string) => v.toUpperCase()}
            width={50}
          />

          <Tooltip
            formatter={(value: number) => [compactNumber(value), "Views"]}
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelFormatter={(label: string) => label.toUpperCase()}
          />

          <Bar dataKey="total_views" fill={ACCENT_CYAN} radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionPerformanceChart;
