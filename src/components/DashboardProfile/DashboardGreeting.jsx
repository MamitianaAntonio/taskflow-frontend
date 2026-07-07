export default function DashboardGreeting({ name = "Unknown" }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening"
  }

  const greeting = getGreeting();

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font text-(--color-info) uppercase tracking-widest font-semibold">
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono text-(--text-primary) tracking-tight">
          {greeting}, {name}
        </h2>
        <span className="text-2xl sm:text-3xl">{greeting.includes("morning") ? "☀️" : greeting.includes("afternoon") ? "🌤️" : "🌙"}</span>
      </div>
      <div className="w-20 h-1 rounded-full bg-linear-to-r from-(--gradient-from) to-(--gradient-to) mt-1" />
    </div>
  )
}
