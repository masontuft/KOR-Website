export const ADD_MILES_AMOUNT = 100;
export const ADD_HOURS_AMOUNT = 100;

/**
 * Formats an ISO date string (e.g. "2024-01-15T00:00:00") to "January 15, 2024".
 * Parses as local date to avoid timezone shift issues.
 */
export const formatReplacedDate = (isoDate: string | null | undefined): string | null => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Builds the tooltip text shown on hover over a WearBar.
 */
export const buildTooltipText = (
  label: string,
  used: number,
  period: number,
  unit: 'miles' | 'hours',
  lastReplacedDate: string | null | undefined,
): string => {
  const wearPercent = period > 0 ? Math.min(Math.round((used / period) * 100), 100) : 0;
  const formattedDate = formatReplacedDate(lastReplacedDate);
  let text = `${label}: worn ${used.toLocaleString()} out of ${period.toLocaleString()} ${unit} (${wearPercent}%)`;
  if (formattedDate) {
    text += `\nLast replaced on ${formattedDate}`;
  }
  return text;
};

/**
 * Returns true for parts that use the "Worn Out / Broke" two-button variant.
 */
export const isChainLike = (label: string): boolean =>
  label === 'Chain' || label === 'Cassette';
