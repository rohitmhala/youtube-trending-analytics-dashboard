import Topbar from "../../components/layout/Topbar";
import Filters from "../../components/dashboard/Filters";
import ChannelKpiCards from "../../components/channels/ChannelKpiCards";
import ChannelTable from "../../components/channels/ChannelTable";
import ChannelScatterChart from "../../components/channels/ChannelScatterChart";
import RegionPerformanceChart from "../../components/channels/RegionPerformanceChart";

const Channels = () => {
  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#E5E9F0]">Channel Analysis</h1>
            <p className="text-xs text-[#6B7685] mt-0.5">
              Channel performance from live Athena Gold-layer data
            </p>
          </div>
          <Filters />
        </div>

        <ChannelKpiCards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <ChannelScatterChart />
          </div>
          <RegionPerformanceChart />
        </div>

        <ChannelTable />
      </div>
    </div>
  );
};

export default Channels;
