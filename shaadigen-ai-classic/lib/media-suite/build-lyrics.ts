export function buildLyrics(
  names: string,
  genre: string,
  story: string,
): string[] {
  const [a = "Aarav", b = "Meera"] = names.split(/\s*&\s*|\s+and\s+/i);
  const storyLine = story.trim()
    ? `From "${story.trim().slice(0, 42)}${story.trim().length > 42 ? "…" : ""}" to forever`
    : "From strangers to soulmates, written in the stars";
  return [
    `🎵 (Soft ${genre.toLowerCase()} intro…)`,
    `${a.trim()}, the moment I saw you, time stood still,`,
    `${b.trim()}, your smile lit up a thousand diyas…`,
    storyLine + ",",
    "Haath thaam ke chalenge, saat janmon tak,",
    `${a.trim()} & ${b.trim()} — do dil, ek kahaani…`,
    "🎵 (Strings swell… tabla joins… chorus rises)",
    "Teri meri yeh shaadi, likhi thi aasmaanon mein ✨",
  ];
}
