import { Loader2, Mic2, Music } from "lucide-react";
import { GENRES, type GenreOption } from "@/lib/constants/media-suite";
import { cn } from "@/lib/utils";

type SongGeneratorFormProps = {
  songNames: string;
  story: string;
  genre: GenreOption;
  loading: boolean;
  onNamesChange: (value: string) => void;
  onStoryChange: (value: string) => void;
  onGenreChange: (genre: GenreOption) => void;
  onGenerate: () => void;
};

export function SongGeneratorForm({
  songNames,
  story,
  genre,
  loading,
  onNamesChange,
  onStoryChange,
  onGenreChange,
  onGenerate,
}: SongGeneratorFormProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
        <Mic2 className="h-5 w-5 text-rose-500" /> AI Love Song Generator
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="song-names"
            className="text-xs font-bold uppercase tracking-wider text-stone-500"
          >
            Couple Names
          </label>
          <input
            id="song-names"
            type="text"
            value={songNames}
            onChange={(e) => onNamesChange(e.target.value)}
            placeholder="e.g. Aarav & Meera"
            className="mt-1.5 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div>
          <label
            htmlFor="song-story"
            className="text-xs font-bold uppercase tracking-wider text-stone-500"
          >
            Your Love Story (prompt)
          </label>
          <textarea
            id="song-story"
            value={story}
            onChange={(e) => onStoryChange(e.target.value)}
            rows={3}
            placeholder="We met over chai at a Delhi book fair, argued about Ghalib, and never stopped talking…"
            className="mt-1.5 w-full resize-none rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Music Genre
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {GENRES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onGenreChange(option)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-semibold transition-all",
                  genre.id === option.id
                    ? "bg-rose-600 text-white shadow"
                    : "border border-stone-300 bg-white text-stone-600 hover:border-rose-400",
                )}
              >
                {option.emoji} {option.name}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Composing melody,
              mixing vocals…
            </>
          ) : (
            <>
              <Music className="h-4 w-4" /> Generate Our Love Song
            </>
          )}
        </button>
      </div>
    </div>
  );
}
