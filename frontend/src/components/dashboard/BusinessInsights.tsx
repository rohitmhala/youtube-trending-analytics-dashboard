import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_AMBER, ACCENT_BLUE, ACCENT_CYAN, ACCENT_GREEN } from "../../theme/colors";

type Insights = {
  top_channel: { channel_title: string; total_views: number };
  top_category: { category: string; total_views: number };
  top_region: { region: string; total_views: number };
  engagement: { avg_engagement_rate: number };
};

const BusinessInsights = () => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/business-insights?region=${filters.region}`);
        setInsights(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [filters.region]);

  if (loading || !insights?.top_channel?.channel_title) {
    return (
      <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full flex items-center justify-center text-sm text-[#6B7685]">
        {loading ? "Loading insights..." : "No data for this selection."}
      </div>
    );
  }

  const rows = [
    {
      label: "Top Channel",
      value: cleanText(insights.top_channel.channel_title),
      subtitle: `${compactNumber(insights.top_channel.total_views)} views`,
      accent: ACCENT_BLUE,
    },
    {
      label: "Top Category",
      value: cleanText(insights.top_category.category),
      subtitle: `${compactNumber(insights.top_category.total_views)} views`,
      accent: ACCENT_AMBER,
    },
    {
      label: "Top Region",
      value: insights.top_region.region.toUpperCase(),
      subtitle: `${compactNumber(insights.top_region.total_views)} views`,
      accent: ACCENT_CYAN,
    },
    {
      label: "Avg Engagement",
      value: `${insights.engagement.avg_engagement_rate}%`,
      subtitle: "across selected region",
      accent: ACCENT_GREEN,
    },
  ];

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5 h-full">
      <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide mb-4">
        Business Insights
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

export default BusinessInsights;
