// Shared design tokens - keeps every panel, chart, and KPI card visually
// consistent instead of each component picking its own ad-hoc colors.

export const BG = "#0A0E14";
export const PANEL_BG = "#12161F";
export const PANEL_BORDER = "#1E2530";
export const PANEL_BORDER_HOVER = "#2A3241";

export const TEXT_PRIMARY = "#E5E9F0";
export const TEXT_MUTED = "#6B7685";

export const GRID_COLOR = "#1E2530";
export const AXIS_COLOR = "#5B6472";

// One accent per chart series - used consistently instead of a random
// color per bar/segment, matching a professional analytics-tool look.
export const ACCENT_BLUE = "#3B82F6";
export const ACCENT_AMBER = "#F59E0B";
export const ACCENT_GREEN = "#10B981";
export const ACCENT_VIOLET = "#8B5CF6";
export const ACCENT_CYAN = "#06B6D4";
export const ACCENT_ROSE = "#F43F5E";

// Muted categorical palette for donut/heatmap segments (desaturated
// versions of the accents above, so multi-segment charts don't read
// as "rainbow").
export const CATEGORY_PALETTE = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#06B6D4",
  "#F43F5E",
  "#84CC16",
  "#EAB308",
];

// Solid gradient blocks for headline KPI cards (matches the reference
// "command center" look - the whole card is the color, not just an icon).
export const KPI_GRADIENTS: Record<string, string> = {
  blue: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
  rose: "linear-gradient(135deg, #9F1239 0%, #E11D48 100%)",
  green: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
  violet: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)",
  amber: "linear-gradient(135deg, #92400E 0%, #F59E0B 100%)",
  cyan: "linear-gradient(135deg, #155E75 0%, #06B6D4 100%)",
};

export type KpiColor = keyof typeof KPI_GRADIENTS;
