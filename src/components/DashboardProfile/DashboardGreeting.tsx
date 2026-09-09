import { faMoon, faSun, faCloudSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SUBTITLES = [
  "Ready to dive into your projects?",
  "Here's what's waiting for you today.",
  "Let's make today count.",
  "Your workspace is all set up.",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: "Still up", icon: faMoon };
  if (hour < 12) return { text: "Good morning", icon: faSun };
  if (hour < 17) return { text: "Good afternoon", icon: faCloudSun };
  if (hour < 21) return { text: "Good evening", icon: faMoon };
  return { text: "Burning the midnight oil", icon: faMoon };
}

function getSubtitle(): string {
  const dayOfYear =
    Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    ) % SUBTITLES.length;
  return SUBTITLES[dayOfYear];
}

export default function DashboardGreeting({ name = "there" }: { name?: string }) {
  const { text: heading, icon } = getGreeting();
  const subtitle = getSubtitle();

  return (
    <div className="flex items-center justify-between gap-4 p-3 sm:p-4">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full bg-(--bg-tertiary) px-3 py-1 font-interface text-[11px] font-bold uppercase tracking-widest text-(--text-secondary)">
          <span className="h-1.5 w-1.5 rounded-full bg-(--accent-color)" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-(--text-primary) sm:text-3xl">
          <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
            {heading}
          </span>
          {`, ${name}!`}
        </h2>

        <p className="mt-1 font-interface text-sm text-(--text-secondary)">
          {subtitle}
        </p>
      </div>

      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--accent-soft)">
        <FontAwesomeIcon icon={icon} className="text-xl text-(--accent-strong)" />
      </span>
    </div>
  );
}