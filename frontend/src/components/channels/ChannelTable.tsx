import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";
import { useFilters } from "../../context/FilterContext";
import { compactNumber } from "../../utils/compactNumber";
import { cleanText } from "../../utils/cleanText";
import { ACCENT_GREEN } from "../../theme/colors";

// Real columns only - no total_likes/total_comments (don't exist on
// channel_analytics).
type Channel = {
  channel_title: string;
  region: string;
  total_views: number;
  total_videos: number;
  avg_engagement_rate: number;
  times_trending: number;
  rank_in_region: number;
};

const PAGE_SIZE = 10;

const ChannelTable = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { filters } = useFilters();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/channel-analysis?region=${filters.region}`);
        setChannels(res.data);
        setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters.region]);

  const filtered = useMemo(() => {
    const query = cleanText(search).toLowerCase();
    return channels.filter((channel) =>
      cleanText(channel.channel_title).toLowerCase().includes(query)
    );
  }, [channels, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1E2530] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          All Channels ({filtered.length})
        </h2>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-[#5B6472]" />
          <input
            placeholder="Search channel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-[#0A0E14] border border-[#1E2530] rounded-md pl-8 pr-3 py-1.5 text-sm text-[#E5E9F0] outline-none focus:border-[#3B82F6] transition w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-[#6B7685]">Loading channels...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0E14]">
                <tr className="text-[#6B7685] text-xs uppercase tracking-wide">
                  <th className="p-3 text-left font-medium">Channel</th>
                  <th className="text-center font-medium">Region</th>
                  <th className="text-center font-medium">Rank</th>
                  <th className="text-right font-medium">Views</th>
                  <th className="text-right font-medium">Videos</th>
                  <th className="text-right font-medium">Times Trending</th>
                  <th className="text-right pr-4 font-medium">Engagement</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((channel) => (
                  <tr
                    key={`${channel.channel_title}-${channel.region}`}
                    className="border-t border-[#1E2530] hover:bg-[#171B23] transition"
                  >
                    <td className="p-3 font-medium text-[#E5E9F0]">
                      {cleanText(channel.channel_title)}
                    </td>
                    <td className="text-center text-[#8B93A3]">
                      {channel.region.toUpperCase()}
                    </td>
                    <td className="text-center text-[#8B93A3] tabular-nums">
                      #{channel.rank_in_region}
                    </td>
                    <td className="text-right text-[#E5E9F0] tabular-nums">
                      {compactNumber(channel.total_views)}
                    </td>
                    <td className="text-right text-[#E5E9F0] tabular-nums">
                      {compactNumber(channel.total_videos)}
                    </td>
                    <td className="text-right text-[#E5E9F0] tabular-nums">
                      {compactNumber(channel.times_trending)}
                    </td>
                    <td
                      className="text-right pr-4 tabular-nums font-medium"
                      style={{ color: ACCENT_GREEN }}
                    >
                      {channel.avg_engagement_rate.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E2530]">
            <p className="text-xs text-[#6B7685]">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md bg-[#0A0E14] border border-[#1E2530] disabled:opacity-30 hover:border-[#2A3241] transition"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md bg-[#0A0E14] border border-[#1E2530] disabled:opacity-30 hover:border-[#2A3241] transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelTable;
