import useUserStore from "../../stores/userStore"
import Button from "../ui/Button";

export default function DashboardProfile() {
  const user = useUserStore(state => state.user);

  return (
    <div className="p-2 space-y-2">
      {/* Title */}
      <h1 className="w-full bg-(--bg-secondary) p-2 border 
        border-(--border-color) rounded-md
        text-2xl font-semibold">
        DashboardProfile
      </h1>

      {/* Profile card */}
      <div className="bg-(--bg-secondary) p-4 border border-(--border-color) rounded-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-(--bg-secondary) flex items-center justify-center">
          A
        </div>

        <div>
          <p className="font-semibold">Antonio</p>
          <p className="">antonio@mail.com</p>
        </div>
      </div>
    </div>
  )
}
