import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUserStore from "../../stores/userStore";
import Button from "../ui/Button";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import TaskOverview from "./TaskOverview";

export default function DashboardProfile() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="p-2 space-y-2">
      {/* Title */}
      <h1
        className="
        w-full bg-(--bg-secondary) px-4 py-3 
         rounded-lg
        text-xl font-semibold tracking-tight text-(--text-primary)
        flex items-center gap-2 border border-(--border-color)
        uppercase font-mono
        "
      >
        <span className=" w-1.5 h-5 bg-(--accent-color) rounded-full" />
        Dashboard Profile
      </h1>

      {/* Profile card */}
      <div className="bg-(--bg-secondary) px-5 py-4 border border-(--border-color) rounded-lg flex items-center gap-4">
        {/* Left — Avatar + Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar */}
          <div
            className="w-16 h-16 text-3xl font-bold text-(--text-white) rounded-lg 
            border border-(--border-color) flex items-center justify-center select-none
            bg-gradient-to-br from-(--gradient-from) to-(--gradient-to) backdrop-blur-sm"
          >
            A
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <p className="font-mono font-semibold text-(--text-primary)">
              Antonio
            </p>
            <p className="text-sm text-(--text-secondary) font-mono">
              antonio@mail.com
            </p>
          </div>
        </div>

        {/* Right — Settings button */}
        <Button variant="outline" className="">
          <FontAwesomeIcon icon={faGear} />
          Settings
        </Button>
      </div>

      {/* Tasks Stats */}
      <TaskOverview />
    </div>
  );
}
