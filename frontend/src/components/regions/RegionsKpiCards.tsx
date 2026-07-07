import { useEffect, useState } from "react";
import api from "../../services/api";
import KpiCard from "../cards/KpiCard";
import { compactNumber } from "../../utils/compactNumber";

// Aggregated client-side from GET /region-performance (one row per
// region, all real columns from trending_analytics).
type Region = {
  region: string;
  total_views: number;
  total_likes: number;
  total_videos: number;
  avg_unique_channels: number;
  avg_engagement_rate: number;
};

const RegionsKpiCards = () => {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/region-performance");
        setRegions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const totalViews = regions.reduce((s, r) => s + Number(r.total_views), 0);
  const totalRegions = regions.length;
  const topRegion = regions[0]?.region?.toUpperCase() ?? "...";
  const avgEngagement =
    regions.length > 0
      ? (
          regions.reduce((s, r) => s + Number(r.avg_engagement_rate), 0) /
          regions.length
        ).toFixed(2)
      : "...";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard title="Total Views (All Regions)" value={compactNumber(totalViews)} color="blue" />
      <KpiCard title="Active Regions" value={compactNumber(totalRegions)} color="cyan" />
      <KpiCard title="Top Region" value={topRegion} color="amber" />
      <KpiCard title="Avg Engagement Rate" value={`${avgEngagement}%`} color="green" />
    </div>
  );
};

export default RegionsKpiCards;
