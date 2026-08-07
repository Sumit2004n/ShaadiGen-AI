"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { AudioEqBars } from "@/components/ui/audio-eq-bars";
import { BAR_HEIGHTS, SONG_DURATION } from "@/lib/constants/media-suite";
import { cn } from "@/lib/utils";
import type { CustomSong } from "@/types/wedding";

type SongPlayerProps = {
  song: CustomSong | null;
  loading: boolean;
};

export function SongPlayer({ song, loading }: SongPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [song?.id]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= SONG_DURATION) {
            setPlaying(false);
            return 0;
          }
          return p + 0.25;
        });
      }, 250);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const activeLyric = song
    ? Math.min(
        Math.floor((progress / SONG_DURATION) * song.lyrics.length),
        song.lyrics.length - 1,
      )
    : 0;

  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-stone-950 p-6 shadow-sm">
      {!song ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="text-5xl">🎧</span>
          <p className="text-sm font-semibold text-stone-300">
            Your custom track will appear here
          </p>
          <p className="max-w-xs text-xs text-stone-500">
            {loading
              ? "AI is arranging strings, tabla and vocals for your story…"
              : "Fill the form and hit Generate — takes ~3 seconds."}
          </p>
          {loading ? (
            <Loader2 className="mt-2 h-8 w-8 animate-spin text-rose-400" />
          ) : null}
        </div>
      ) : (
        <div className="animate-fade-up flex flex-1 flex-col">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-3xl shadow-lg">
              💞
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-white">
                {song.title}
              </h3>
              <p className="text-xs text-stone-400">
                {song.genre} · Generated for {song.coupleNames}
              </p>
            </div>
          </div>

          <AudioEqBars
            heights={BAR_HEIGHTS}
            active={playing}
            className="mt-6 h-16"
            barClassName="w-2 from-rose-500 to-amber-400"
          />

          <div className="mt-5">
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all"
                style={{ width: `${(progress / SONG_DURATION) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-stone-500">
              <span>0:{String(Math.floor(progress)).padStart(2, "0")}</span>
              <span>0:{SONG_DURATION}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg transition-all hover:scale-105"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-6 w-6 fill-white" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-white" />
              )}
            </button>
          </div>

          <div className="mt-5 max-h-40 space-y-1 overflow-y-auto rounded-xl bg-stone-900 p-4">
            {song.lyrics.map((line, i) => (
              <p
                key={i}
                className={cn(
                  "text-xs leading-relaxed transition-all duration-300",
                  playing && i === activeLyric
                    ? "scale-[1.02] font-bold text-amber-300"
                    : "text-stone-400",
                )}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
