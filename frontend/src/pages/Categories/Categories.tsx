import Topbar from "../../components/layout/Topbar";
import Filters from "../../components/dashboard/Filters";
import CategoryKpiCards from "../../components/categories/CategoryKpiCards";
import CategoryChart from "../../components/charts/CategoryChart";
import CategoryPerformanceChart from "../../components/analytics/CategoryPerformanceChart";
import CategoryHeatmap from "../../components/categories/CategoryHeatmap";

const Categories = () => {
  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#E5E9F0]">Category Analytics</h1>
            <p className="text-xs text-[#6B7685] mt-0.5">
              Category-level breakdowns and view share
            </p>
          </div>
          <Filters />
        </div>

        <CategoryKpiCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <CategoryChart />
          <CategoryPerformanceChart />
        </div>

        <CategoryHeatmap />
      </div>
    </div>
  );
};

export default Categories;
