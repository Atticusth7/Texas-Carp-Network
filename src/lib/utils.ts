export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatWeight(lbs: number | null | undefined): string {
  if (lbs == null) return "—";
  return `${lbs} lb${lbs !== 1 ? "s" : ""}`;
}

export function formatLength(inches: number | null | undefined): string {
  if (inches == null) return "—";
  return `${inches}"`;
}

export function formatTemp(f: number | null | undefined): string {
  if (f == null) return "—";
  return `${f}°F`;
}

export const CARP_SPECIES = [
  "Common Carp",
  "Mirror Carp",
  "Grass Carp",
  "Bighead Carp",
  "Silver Carp",
  "Leather Carp",
  "Ghost Carp",
  "Koi",
  "Other",
] as const;

export const GEAR_TYPES = [
  "Rod",
  "Reel",
  "Line",
  "Hook",
  "Bait",
  "Rig",
  "Lead/Sinker",
  "Net",
  "Other",
] as const;

export const CLARITY_OPTIONS = [
  { value: "clear", label: "Clear" },
  { value: "slightly_stained", label: "Slightly Stained" },
  { value: "stained", label: "Stained" },
  { value: "murky", label: "Murky" },
] as const;

export const CURRENT_OPTIONS = [
  { value: "still", label: "Still" },
  { value: "slow", label: "Slow" },
  { value: "moderate", label: "Moderate" },
  { value: "fast", label: "Fast" },
] as const;

export const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny" },
  { value: "partly_cloudy", label: "Partly Cloudy" },
  { value: "overcast", label: "Overcast" },
  { value: "rainy", label: "Rainy" },
  { value: "windy", label: "Windy" },
] as const;
