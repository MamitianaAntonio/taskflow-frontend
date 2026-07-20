import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCloudSun } from "@fortawesome/free-solid-svg-icons";

const SUBTITLES = [
  "Ready to dive into your projects?",
  "Here's what's waiting for you today.",
  "Let's make today count.",
  "Your workspace is all set up.",
];

export default function DashboardGreeting({ name = "there" }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return { text: "Still up", icon: faMoon };
    if (hour < 12) return { text: "Good morning", icon: faSun };
    if (hour < 17) return { text: "Good afternoon", icon: faCloudSun };
    if (hour < 21) return { text: "Good evening", icon: faMoon };
    return { text: "Burning the midnight oil", icon: faMoon };
  };

  const { text: greeting, icon } = getGreeting();
  const subtitle = SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)];

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest font-interface">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight mt-1">
          <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
            {greeting}
          </span>
          {`, ${name}!`}
        </h2>

        <p className="text-md text-(--text-primary) opacity-60 mt-1 font-interface">
          {subtitle}
        </p>
      </div>

      <FontAwesomeIcon
        icon={icon}
        className="text-2xl sm:text-3xl text-(--text-primary) opacity-20"
      />
    </div>
  );
}
