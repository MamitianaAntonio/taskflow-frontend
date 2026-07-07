export default function DashboardGreeting({ name = "Unknown" }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening"
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font text-(--text-primary) opacity-40 uppercase tracking-widest">
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-(--text-primary) tracking-tight">
        {getGreeting()}, {name} 👋
      </h2>
    </div>
  )
}
