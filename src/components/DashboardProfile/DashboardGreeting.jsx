export default function DashboardGreeting({ name = "there" }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening"
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font text-(--color-info) uppercase tracking-widest font-semibold font-interface">
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-(--text-primary) tracking-tight">
        {getGreeting()}, {name}
      </h2>
    </div>
  )
}
