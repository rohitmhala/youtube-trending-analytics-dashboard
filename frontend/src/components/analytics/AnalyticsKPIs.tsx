import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import KpiCard from "../cards/KpiCard";

type KPI = {
  avg_views_per_video: number;
  avg_engagement_rate: number;
  avg_like_ratio: number;
  avg_unique_categories: number;
};

const AnalyticsKPIs = () => {
  const [data, setData] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/analytics-kpis?region=${filters.region}`);
        setData(res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KpiCard
        title="Avg Views / Video"
        value={loading ? "..." : compactNumber(data?.avg_views_per_video ?? 0)}
        color="blue"
      />
      <KpiCard
        title="Avg Engagement Rate"
        value={loading ? "..." : `${data?.avg_engagement_rate ?? 0}%`}
        color="green"
      />
      <KpiCard
        title="Avg Like Ratio"
        value={loading ? "..." : `${data?.avg_like_ratio ?? 0}`}
        color="amber"
      />
      <KpiCard
        title="Unique Categories/Day"
        value={loading ? "..." : compactNumber(data?.avg_unique_categories ?? 0)}
        color="violet"
      />
    </div>
  );
};

export default AnalyticsKPIs;
