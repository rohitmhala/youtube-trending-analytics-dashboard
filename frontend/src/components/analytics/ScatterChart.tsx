import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_ROSE, GRID_COLOR, AXIS_COLOR } from "../../theme/colors";

import {
  ResponsiveContainer,
  ScatterChart as ReScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
} from "recharts";

// channel_analytics has no total_likes/total_comments column, so this
// plots real views against real engagement rate instead, with total
// videos driving bubble size - all real columns.
type Channel = {
  channel_title: string;
  total_views: number;
  total_videos: number;
  avg_engagement_rate: number;
};

const ScatterChart = () => {
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
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
        Views vs Engagement
      </h2>
      <p className="text-xs text-[#6B7685] mt-1 mb-4">
        Bubble size = video count
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <ReScatterChart margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="total_views"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={compactNumber}
            name="Views"
          />

          <YAxis
            type="number"
            dataKey="avg_engagement_rate"
            stroke={AXIS_COLOR}
            fontSize={11}
            tickFormatter={(v) => `${v}%`}
            name="Engagement Rate"
          />

          <ZAxis dataKey="total_videos" range={[60, 380]} />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "#12161F",
              border: "1px solid #1E2530",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) =>
              name === "Engagement Rate" ? `${value.toFixed(2)}%` : compactNumber(value)
            }
            labelFormatter={(_, payload) =>
              payload && payload.length ? payload[0].payload.channel_title : ""
            }
          />

          <Scatter data={data} fill={ACCENT_ROSE} />
        </ReScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChart;
