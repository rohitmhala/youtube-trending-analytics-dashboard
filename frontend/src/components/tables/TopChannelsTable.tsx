import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";

type Channel = {
  channel_title: string;
  region: string;
  total_views: number;
  total_videos: number;
  avg_engagement_rate: number;
  times_trending: number;
  rank_in_region: number;
};

const TopChannelsTable = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { filters } = useFilters();

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/top-channels?region=${filters.region}`);
        setChannels(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, [filters.region]);

  const filtered = useMemo(() => {
    const query = cleanText(search).toLowerCase();
    return channels.filter((channel) =>
      cleanText(channel.channel_title).toLowerCase().includes(query)
    );
  }, [channels, search]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2530]">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Top Performing Channels
        </h2>

        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2 text-[#6B7685]" />
          <input
            placeholder="Search channel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0A0E14] border border-[#1E2530] rounded-md pl-7 pr-3 py-1.5 text-xs text-[#E5E9F0] outline-none focus:border-[#3B82F6] transition w-52"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6B7685] text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6B7685] text-xs uppercase tracking-wide border-b border-[#1E2530]">
                <th className="text-left py-2.5 px-5 font-medium">Rank</th>
                <th className="text-left font-medium">Channel</th>
                <th className="text-center font-medium">Region</th>
                <th className="text-right font-medium">Views</th>
                <th className="text-right font-medium">Videos</th>
                <th className="text-right font-medium">Trending Count</th>
                <th className="text-right font-medium pr-5">Engagement</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item, index) => (
                <tr
                  key={`${item.channel_title}-${item.region}`}
                  className="border-b border-[#1E2530] last:border-0 hover:bg-[#161B26] transition-colors"
                >
                  <td className="py-2.5 px-5 text-[#6B7685] tabular-nums">
                    {index + 1}
                  </td>

                  <td className="text-[#E5E9F0] font-medium">
                    {cleanText(item.channel_title)}
                  </td>

                  <td className="text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E2530] text-[#8B93A3] uppercase">
                      {item.region}
                    </span>
                  </td>

                  <td className="text-right text-[#E5E9F0] tabular-nums">
                    {compactNumber(item.total_views)}
                  </td>

                  <td className="text-right text-[#8B93A3] tabular-nums">
                    {compactNumber(item.total_videos)}
                  </td>

                  <td className="text-right text-[#8B93A3] tabular-nums">
                    {compactNumber(item.times_trending)}
                  </td>

                  <td className="text-right pr-5 tabular-nums">
                    <span className="text-[#10B981] font-medium">
                      {item.avg_engagement_rate.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default TopChannelsTable;
