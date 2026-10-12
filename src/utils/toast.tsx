import toast from "react-hot-toast";
import TaskFlowToast from "../components/ui/TaskFlowToast";

const SUCCESS_DURATION = 3500;
const ERROR_DURATION = 5000;

interface NotifyOptions {
  duration?: number;
}

export const notify = {
  success(message: string, { duration = SUCCESS_DURATION }: NotifyOptions = {}) {
    toast.custom(
      (t) => (
        <TaskFlowToast t={t} type="success" message={message} duration={duration} />
      ),
      { duration },
    );
  },
  error(message: string, { duration = ERROR_DURATION }: NotifyOptions = {}) {
    toast.custom(
      (t) => (
        <TaskFlowToast t={t} type="error" message={message} duration={duration} />
      ),
      { duration },
    );
  },
};