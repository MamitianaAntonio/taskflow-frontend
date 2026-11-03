import { useMemo } from "react";
import {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  MoonStar,
  type LucideIcon,
} from "lucide-react";

const SUBTITLES = [
  "Ready to dive into your projects?",
  "Here's what's waiting for you today.",
  "Let's make today count.",
  "Your workspace is all set up.",
];

function getGreeting(hour: number): { text: string; Icon: LucideIcon } {
  if (hour < 5) return { text: "Still up", Icon: MoonStar };
  if (hour < 9) return { text: "Good morning", Icon: Sunrise };
  if (hour < 12) return { text: "Good morning", Icon: Sun };
  if (hour < 17) return { text: "Good afternoon", Icon: CloudSun };
  if (hour < 21) return { text: "Good evening", Icon: Sunset };
  return { text: "Burning the midnight oil", Icon: Moon };
}

function getSubtitle(now: Date): string {
  const startOfYear = new Date(now.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86400000);
  return SUBTITLES[dayOfYear % SUBTITLES.length];
}

export default function DashboardGreeting({
  name = "there",
}: {
  name?: string;
}) {
  const { heading, Icon, subtitle, date } = useMemo(() => {
    const now = new Date();
    const { text, Icon } = getGreeting(now.getHours());
    return {
      heading: text,
      Icon,
      subtitle: getSubtitle(now),
      date: now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    };
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div className="min-w-0">
      {/* Eyebrow : icône + date */}
      <div className="flex items-center gap-2 font-interface text-xs font-semibold uppercase tracking-[0.18em] text-(--text-muted)">
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className="h-4 w-4 text-(--accent-strong)"
        />
        {date}
      </div>

      {/* Titre */}
      <h2 className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-(--text-primary) sm:text-3xl lg:text-4xl">
        <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
          {heading}
        </span>
        {`, ${firstName}`}
      </h2>

      {/* Sous-titre */}
      <p className="mt-2 font-interface text-sm text-(--text-secondary) sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
