import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import KpiCard from "../cards/KpiCard";
import { compactNumber } from "../../utils/compactNumber";

// Real columns only - channel_analytics has no total_likes.
type KPI = {
  total_views: number;
  total_videos: number;
  active_channels: number;
  avg_engagement_rate: number;
};

const ChannelKpiCards = () => {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/channel-kpis?region=${filters.region}`);
        setKpi(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard
        title="Total Views"
        value={kpi ? compactNumber(kpi.total_views) : "..."}
        color="blue"
      />
      <KpiCard
        title="Total Videos"
        value={kpi ? compactNumber(kpi.total_videos) : "..."}
        color="violet"
      />
      <KpiCard
        title="Active Channels"
        value={kpi ? compactNumber(kpi.active_channels) : "..."}
        color="cyan"
      />
      <KpiCard
        title="Avg Engagement"
        value={kpi ? `${kpi.avg_engagement_rate}%` : "..."}
        color="green"
      />
    </div>
  );
};

export default ChannelKpiCards;
