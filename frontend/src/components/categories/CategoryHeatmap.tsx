import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { cleanText } from "../../utils/cleanText";

// One row per (region, category) with real avg_engagement_rate -
// no region filter here since a heatmap's whole purpose is comparing
// every region side by side at once.
type Cell = {
  region: string;
  category: string;
  avg_engagement_rate: number;
};

const colorForValue = (value: number, max: number) => {
  if (max === 0) return "rgba(59,130,246,0.06)";
  const intensity = Math.min(1, value / max);
  return `rgba(59, 130, 246, ${0.1 + intensity * 0.7})`;
};

const CategoryHeatmap = () => {
  const [data, setData] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/category-region-heatmap");
        const cleaned = res.data.map((row: Cell) => ({
          ...row,
          category: cleanText(row.category),
        }));
        setData(cleaned);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const { regions, categories, grid, max } = useMemo(() => {
    const regionSet = Array.from(new Set(data.map((d) => d.region))).sort();
    const categorySet = Array.from(new Set(data.map((d) => d.category))).sort();

    const lookup: Record<string, number> = {};
    let maxVal = 0;

    data.forEach((d) => {
      lookup[`${d.region}__${d.category}`] = d.avg_engagement_rate;
      if (d.avg_engagement_rate > maxVal) maxVal = d.avg_engagement_rate;
    });

    return { regions: regionSet, categories: categorySet, grid: lookup, max: maxVal };
  }, [data]);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Engagement Heatmap
        </h2>
        <p className="text-xs text-[#6B7685] mt-1">
          Average engagement rate by category and region
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#6B7685] text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-[#6B7685] p-2 sticky left-0 bg-[#12161F] font-medium">
                  Category
                </th>
                {regions.map((region) => (
                  <th key={region} className="text-[#6B7685] p-2 text-center font-medium">
                    {region.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category}>
                  <td className="p-2 text-[#E5E9F0] font-medium sticky left-0 bg-[#12161F] whitespace-nowrap">
                    {category}
                  </td>
                  {regions.map((region) => {
                    const value = grid[`${region}__${category}`];

                    return (
                      <td key={region} className="p-1">
                        <div
                          className="rounded-md h-9 flex items-center justify-center text-[#E5E9F0] font-medium tabular-nums"
                          style={{
                            backgroundColor:
                              value !== undefined
                                ? colorForValue(value, max)
                                : "rgba(107,118,133,0.08)",
                          }}
                          title={
                            value !== undefined
                              ? `${category} in ${region.toUpperCase()}: ${value}%`
                              : "No data"
                          }
                        >
                          {value !== undefined ? `${value}%` : "-"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryHeatmap;
