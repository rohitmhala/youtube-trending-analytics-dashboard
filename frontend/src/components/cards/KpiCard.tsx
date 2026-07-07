import { KPI_GRADIENTS } from "../../theme/colors";
import type { KpiColor } from "../../theme/colors";

type KpiCardProps = {
  title: string;
  value: string;
  color?: KpiColor;
  subtitle?: string;
};

/**
 * Solid gradient stat block - matches the reference dashboard's KPI
 * style (flat color fill, large tabular value), not an animated card
 * with an icon avatar. Color is explicit per call site (see
 * theme/colors.ts KPI_GRADIENTS) so related pages can pick a
 * consistent palette rather than a random one.
 */
const KpiCard = ({ title, value, color = "blue", subtitle }: KpiCardProps) => {
  return (
    <div
      className="rounded-lg p-4 flex flex-col justify-between min-h-[92px]"
      style={{ background: KPI_GRADIENTS[color] }}
    >
      <span className="text-white/80 text-xs font-medium tracking-wide">
        {title}
      </span>

      <span className="text-white text-2xl font-semibold tabular-nums mt-2">
        {value}
      </span>

      {subtitle && (
        <span className="text-white/60 text-[11px] mt-1">{subtitle}</span>
      )}
    </div>
  );
};

export default KpiCard;
