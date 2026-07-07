import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../services/api";
import { compactNumber } from "../../utils/compactNumber";
import { ACCENT_BLUE } from "../../theme/colors";

// Real-world capital coordinates for the 10 regions the pipeline
// supports (per the README). These are geographic reference points
// only - marker position, not business data - the actual numbers
// plotted (views/engagement) come live from the API below.
const REGION_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  us: { lat: 38.9072, lng: -77.0369, name: "United States" },
  gb: { lat: 51.5074, lng: -0.1278, name: "United Kingdom" },
  ca: { lat: 45.4215, lng: -75.6972, name: "Canada" },
  de: { lat: 52.52, lng: 13.405, name: "Germany" },
  fr: { lat: 48.8566, lng: 2.3522, name: "France" },
  in: { lat: 28.6139, lng: 77.209, name: "India" },
  jp: { lat: 35.6895, lng: 139.6917, name: "Japan" },
  kr: { lat: 37.5665, lng: 126.978, name: "South Korea" },
  mx: { lat: 19.4326, lng: -99.1332, name: "Mexico" },
  ru: { lat: 55.7558, lng: 37.6173, name: "Russia" },
};

type Region = {
  region: string;
  total_views: number;
  avg_engagement_rate: number;
};

const RegionsMap = () => {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/region-performance");
        setRegions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const maxViews = Math.max(...regions.map((r) => Number(r.total_views)), 1);

  return (
    <div className="bg-[#12161F] border border-[#1E2530] rounded-lg p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-[#8B93A3] uppercase tracking-wide">
          Regional Views Map
        </h2>
        <p className="text-xs text-[#6B7685] mt-1">
          Circle size = total views
        </p>
      </div>

      <div className="rounded-md overflow-hidden" style={{ height: 380 }}>
        <MapContainer
          center={[25, 20]}
          zoom={2}
          minZoom={2}
          style={{ height: "100%", width: "100%", background: "#0A0E14" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />

          {regions.map((r) => {
            const coord = REGION_COORDS[r.region.toLowerCase()];
            if (!coord) return null;

            // Radius scaled by real views relative to the largest region
            const radius = 6 + (Number(r.total_views) / maxViews) * 26;

            return (
              <CircleMarker
                key={r.region}
                center={[coord.lat, coord.lng]}
                radius={radius}
                pathOptions={{
                  color: ACCENT_BLUE,
                  fillColor: ACCENT_BLUE,
                  fillOpacity: 0.45,
                  weight: 1.5,
                }}
              >
                <Tooltip>
                  <div>
                    <strong>{coord.name}</strong>
                    <br />
                    Views: {compactNumber(r.total_views)}
                    <br />
                    Engagement: {r.avg_engagement_rate}%
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default RegionsMap;
