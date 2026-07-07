import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_BLUE, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

type Channel = {
  channel_title: string;
  total_views: number;
  total_videos: number;
  avg_engagement_rate: number;
};

const ChannelScatterChart = () => {
  const [data, setData] = useState<Channel[]>([]);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/channel-scatter?region=${filters.region}`);
        const cleaned = res.data.map((row: Channel) => ({
          ...row,
          channel_title: cleanText(row.channel_title),
        }));
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
        Views vs Engagement
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />

          <XAxis
            dataKey="total_views"
            stroke={AXIS_COLOR}
            fontSize={11}
            name="Views"
            tickFormatter={compactNumber}
          />

          <YAxis
            dataKey="avg_engagement_rate"
            stroke={AXIS_COLOR}
            fontSize={11}
            name="Engagement Rate"
            tickFormatter={(v) => `${v}%`}
          />

          <ZAxis dataKey="total_videos" range={[60, 400]} />

          <Tooltip
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value, name) =>
  name === "Engagement Rate"
    ? `${Number(value ?? 0).toFixed(2)}%`
    : compactNumber(Number(value ?? 0))
}
            labelFormatter={(_, payload: any) =>
              payload?.[0]?.payload?.channel_title || ""
            }
          />

          <Scatter data={data} fill={ACCENT_BLUE} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChannelScatterChart;
