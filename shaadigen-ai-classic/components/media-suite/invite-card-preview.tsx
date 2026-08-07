import { Calendar, MapPin, Play } from "lucide-react";
import type { InviteThemeColor } from "@/lib/constants/media-suite";
import type { AIInviteCard } from "@/types/wedding";

type InviteCardPreviewProps = {
  invite: AIInviteCard;
  theme: InviteThemeColor;
  onPlayGreeting: () => void;
};

export function InviteCardPreview({
  invite,
  theme,
  onPlayGreeting,
}: InviteCardPreviewProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-full max-w-sm rounded-3xl border-2 bg-gradient-to-br p-8 text-center shadow-xl transition-all duration-500 ${theme.card}`}
      >
        <p className={`text-xs uppercase tracking-[0.3em] ${theme.accent}`}>
          ॥ शुभ विवाह ॥
        </p>
        <p className="mt-4 text-4xl">💍</p>
        <h3
          className={`font-serif mt-3 break-words text-3xl font-bold ${theme.text}`}
        >
          {invite.coupleNames}
        </h3>
        <p className={`mt-2 text-sm font-medium ${theme.accent}`}>
          joyfully invite you to their wedding
        </p>
        <div
          className={`mt-5 space-y-1.5 text-sm font-semibold ${theme.text}`}
        >
          <p className="flex items-center justify-center gap-1.5">
            <Calendar className="h-4 w-4" /> {invite.eventDate}
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <MapPin className="h-4 w-4" /> {invite.venue}
          </p>
        </div>
        <button
          type="button"
          onClick={onPlayGreeting}
          className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all hover:scale-105 ${theme.accent} border-current`}
        >
          <Play className="h-3.5 w-3.5" /> Personalized Audio Greeting
        </button>
      </div>
    </div>
  );
}
