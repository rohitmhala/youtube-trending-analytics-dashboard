import Topbar from "../../components/layout/Topbar";
import RegionsKpiCards from "../../components/regions/RegionsKpiCards";
import RegionsMap from "../../components/regions/RegionsMap";
import RegionPerformanceChart from "../../components/channels/RegionPerformanceChart";

const Regions = () => {
  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-[#E5E9F0]">Regional Analytics</h1>
          <p className="text-xs text-[#6B7685] mt-0.5">
            Comparing performance across all supported regions
          </p>
        </div>

        <RegionsKpiCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RegionsMap />
          <RegionPerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default Regions;
