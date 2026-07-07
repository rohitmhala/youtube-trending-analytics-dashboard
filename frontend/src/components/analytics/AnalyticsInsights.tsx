import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_AMBER, ACCENT_BLUE, ACCENT_GREEN, ACCENT_VIOLET } from "../../theme/colors";

type Insights = {
  top_channel: { channel_title: string; total_views: number };
  top_category: { category: string; engagement: number };
  peak: { peak_day_views: number };
  trending: { times_trending: number };
};

const AnalyticsInsights = () => {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/analytics-insights?region=${filters.region}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters.region]);

  if (loading || !data) {
    return (
      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full flex items-center justify-center text-sm text-[#6B7685]">
        Loading insights...
      </div>
    );
  }

  const rows = [
    {
      label: "Top Channel",
      value: data.top_channel?.channel_title ? cleanText(data.top_channel.channel_title) : "N/A",
      subtitle: `${compactNumber(data.top_channel?.total_views ?? 0)} views`,
      accent: ACCENT_BLUE,
    },
    {
      label: "Top Category (by engagement)",
      value: data.top_category?.category ? cleanText(data.top_category.category) : "N/A",
      subtitle: `${Number(data.top_category?.engagement ?? 0).toFixed(2)}% engagement`,
      accent: ACCENT_VIOLET,
    },
    {
      label: "Peak Day Views",
      value: compactNumber(data.peak?.peak_day_views ?? 0),
      subtitle: "Highest single-day total",
      accent: ACCENT_AMBER,
    },
    {
      label: "Times Trending",
      value: compactNumber(data.trending?.times_trending ?? 0),
      subtitle: "Across all channels",
      accent: ACCENT_GREEN,
    },
  ];

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-4">
        Analytics Insights
      </h2>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 pl-3 py-2 border-l-2 bg-[#0A0E14] rounded-r-md"
            style={{ borderColor: row.accent }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7685] uppercase tracking-wide">
                {row.label}
              </p>
              <p className="text-sm font-medium text-[#E5E9F0] truncate">
                {row.value}
              </p>
              <p className="text-xs text-[#6B7685]">{row.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsInsights;
