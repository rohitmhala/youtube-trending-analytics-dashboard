import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import KpiCard from "../cards/KpiCard";
import { compactNumber } from "../../utils/compactNumber";

type KPI = {
  total_categories: number;
  total_views: number;
  total_videos: number;
  avg_engagement_rate: number;
};

const CategoryKpiCards = () => {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/category-kpis?region=${filters.region}`);
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
        title="Total Categories"
        value={kpi ? compactNumber(kpi.total_categories) : "..."}
        color="blue"
      />
      <KpiCard
        title="Total Views"
        value={kpi ? compactNumber(kpi.total_views) : "..."}
        color="violet"
      />
      <KpiCard
        title="Total Videos"
        value={kpi ? compactNumber(kpi.total_videos) : "..."}
        color="cyan"
      />
      <KpiCard
        title="Avg Engagement Rate"
        value={kpi ? `${kpi.avg_engagement_rate}%` : "..."}
        color="green"
      />
    </div>
  );
};

export default CategoryKpiCards;
