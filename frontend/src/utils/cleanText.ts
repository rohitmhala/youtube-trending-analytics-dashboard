/**
 * Strips common CSV-export artifacts from text fields (channel titles,
 * category names) that come from the Kaggle-sourced portion of the
 * pipeline - most commonly stray wrapping quote characters and
 * duplicated whitespace introduced when the original CSV was written.
 *
 * This matters for search specifically: if a channel_title is stored
 * as `"SpaceX"` (with literal quote characters) instead of `SpaceX`,
 * a user typing "SpaceX" into a search box won't match it even though
 * it looks identical on screen - because the underlying string isn't
 * actually identical. Cleaning both the stored value and the search
 * term the same way fixes that.
 */
export const cleanText = (value: string | null | undefined): string => {
  if (!value) return "";

  return value
    .toString()
    .trim()
    // strip wrapping straight or curly quotes, possibly repeated
    .replace(/^["'\u201C\u201D]+/, "")
    .replace(/["'\u201C\u201D]+$/, "")
    .trim()
    // collapse any repeated whitespace (tabs, double spaces, etc.)
    .replace(/\s+/g, " ");
};
