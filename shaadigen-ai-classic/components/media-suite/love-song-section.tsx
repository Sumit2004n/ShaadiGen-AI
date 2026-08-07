"use client";

import { useState } from "react";
import { SongGeneratorForm } from "@/components/media-suite/song-generator-form";
import { SongPlayer } from "@/components/media-suite/song-player";
import { useToast } from "@/components/toast";
import { GENRES, type GenreOption } from "@/lib/constants/media-suite";
import { buildLyrics } from "@/lib/media-suite/build-lyrics";
import type { CustomSong } from "@/types/wedding";

export function LoveSongSection() {
  const toast = useToast();
  const [songNames, setSongNames] = useState("Aarav & Meera");
  const [story, setStory] = useState("");
  const [genre, setGenre] = useState<GenreOption>(GENRES[0]);
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState<CustomSong | null>(null);

  function generateSong() {
    if (!songNames.trim()) {
      toast("Enter the couple's names to compose their song!", "info");
      return;
    }
    setLoading(true);
    setSong(null);
    setTimeout(() => {
      setLoading(false);
      setSong({
        id: `song-${Date.now()}`,
        title: `Teri Meri Shaadi (${songNames.trim()}'s Anthem)`,
        coupleNames: songNames.trim(),
        genre: genre.name,
        audioUrl: "mock://shaadigen/love-song.mp3",
        lyrics: buildLyrics(songNames, genre.name, story),
      });
      toast("Song Generated! Press play to preview 🎶", "ai");
    }, 2500);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-2">
      <SongGeneratorForm
        songNames={songNames}
        story={story}
        genre={genre}
        loading={loading}
        onNamesChange={setSongNames}
        onStoryChange={setStory}
        onGenreChange={setGenre}
        onGenerate={generateSong}
      />
      <SongPlayer song={song} loading={loading} />
    </section>
  );
}
