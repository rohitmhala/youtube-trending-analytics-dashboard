import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_BLUE, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Channel = {
  channel_title: string;
  total_views: number;
};

const TopChannelsBarChart = () => {
  const [data, setData] = useState<Channel[]>([]);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/top-channels?region=${filters.region}`);
        const cleaned = res.data
          .slice(0, 8)
          .map((row: Channel) => ({ ...row, channel_title: cleanText(row.channel_title) }));
        setData(cleaned);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Top Channels by Views
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            stroke={GRID_COLOR}
            strokeDasharray="3 3"
            horizontal={false}
          />

          <XAxis
            type="number"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={compactNumber}
          />

          <YAxis
            type="category"
            dataKey="channel_title"
            stroke={AXIS_COLOR}
            fontSize={11}
            width={110}
            tickFormatter={(name: string) =>
              name.length > 14 ? `${name.slice(0, 14)}...` : name
            }
          />

          <Tooltip
            formatter={(value: number) => [compactNumber(value), "Views"]}
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#E5E9F0" }}
          />

          <Bar dataKey="total_views" fill={ACCENT_BLUE} radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopChannelsBarChart;
