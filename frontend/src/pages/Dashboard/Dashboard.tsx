import { useEffect, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import Filters from "../../components/dashboard/Filters";
import KpiCard from "../../components/cards/KpiCard";
import ViewsChart from "../../components/charts/ViewsChart";
import CategoryChart from "../../components/charts/CategoryChart";
import TopChannelsBarChart from "../../components/charts/TopChannelsBarChart";
import CategoryShareMonitor from "../../components/dashboard/CategoryShareMonitor";
import TopChannelsTable from "../../components/tables/TopChannelsTable";
import BusinessInsights from "../../components/dashboard/BusinessInsights";
import api from "../../services/api";
import { compactNumber } from "../../utils/compactNumber";
import { useFilters } from "../../context/FilterContext";

// Real shape returned by GET /api/kpis (see backend/app/api/dashboard.py).
// avg_unique_channels/categories are genuine daily averages from
// trending_analytics, not totals - summing per-day "unique channels"
// across many days would double-count the same channels repeatedly.
type KPIData = {
  total_views: number;
  total_likes: number;
  total_videos: number;
  avg_engagement_rate: number;
  avg_unique_channels: number;
  avg_unique_categories: number;
};

const Dashboard = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/kpis?region=${filters.region}`);
        setKpis(res.data[0]);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters.region]);

  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#E5E9F0]">Dashboard Overview</h1>
            <p className="text-xs text-[#6B7685] mt-0.5">Executive YouTube Analytics</p>
          </div>
          <Filters />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard
            title="Total Views"
            value={loading ? "..." : compactNumber(kpis?.total_views ?? 0)}
            color="blue"
          />
          <KpiCard
            title="Total Videos"
            value={loading ? "..." : compactNumber(kpis?.total_videos ?? 0)}
            color="violet"
          />
          <KpiCard
            title="Total Likes"
            value={loading ? "..." : compactNumber(kpis?.total_likes ?? 0)}
            color="rose"
          />
          <KpiCard
            title="Avg Engagement"
            value={loading ? "..." : `${kpis?.avg_engagement_rate ?? 0}%`}
            color="green"
          />
          <KpiCard
            title="Channels / Day"
            value={loading ? "..." : compactNumber(kpis?.avg_unique_channels ?? 0)}
            color="cyan"
          />
          <KpiCard
            title="Categories / Day"
            value={loading ? "..." : compactNumber(kpis?.avg_unique_categories ?? 0)}
            color="amber"
          />
        </div>

        {/* Row 1: trend line + donut */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ViewsChart />
          </div>
          <CategoryChart />
        </div>

        {/* Row 2: bar chart + progress monitor */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <TopChannelsBarChart />
          </div>
          <CategoryShareMonitor />
        </div>

        {/* Top channels table */}
        <TopChannelsTable />

        {/* Business Insights */}
        <BusinessInsights />
      </div>
    </div>
  );
};

export default Dashboard;
