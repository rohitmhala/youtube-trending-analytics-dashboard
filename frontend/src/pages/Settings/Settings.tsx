import Topbar from "../../components/layout/Topbar";
import SystemInfo from "../../components/settings/SystemInfo";

const Settings = () => {
  return (
    <div className="flex-1 bg-[#0A0E14] min-h-screen">
      <Topbar />

      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-[#E5E9F0]">Settings</h1>
          <p className="text-xs text-[#6B7685] mt-0.5">
            Live configuration and architecture reference for this dashboard
          </p>
        </div>

        <SystemInfo />
      </div>
    </div>
  );
};

export default Settings;
