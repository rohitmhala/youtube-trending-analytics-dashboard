import Topbar from "../../components/layout/Topbar";
import Filters from "../../components/dashboard/Filters";
import AnalyticsKPIs from "../../components/analytics/AnalyticsKPIs";
import ScatterChart from "../../components/analytics/ScatterChart";
import CategoryChart from "../../components/charts/CategoryChart";
import CategoryPerformanceChart from "../../components/analytics/CategoryPerformanceChart";
import EngagementDistributionChart from "../../components/analytics/EngagementDistributionChart";
import AnalyticsInsights from "../../components/analytics/AnalyticsInsights";

const Analytics = () => {
  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#E5E9F0]">Advanced Analytics</h1>
            <p className="text-xs text-[#6B7685] mt-0.5">
              Deep analysis of YouTube trends and engagement
            </p>
          </div>
          <Filters />
        </div>

        <AnalyticsKPIs />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ScatterChart />
          <CategoryChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <EngagementDistributionChart />
          <CategoryPerformanceChart />
        </div>

        <AnalyticsInsights />
      </div>
    </div>
  );
};

export default Analytics;
