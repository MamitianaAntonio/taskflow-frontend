import type { FormEvent } from "react";
import { CalendarDays, FolderPlus, Plus } from "lucide-react";

interface ProjectCreationProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  handleCreate: (e: FormEvent) => void;
}

export default function ProjectCreation({
  name,
  setName,
  description,
  setDescription,
  dueDate,
  setDueDate,
  handleCreate,
}: ProjectCreationProps) {
  return (
    <form
      onSubmit={handleCreate}
      className="
        group relative flex flex-col gap-1 overflow-hidden
        rounded-lg border border-(--border-color)
        bg-white/4 p-2 shadow-[0_8px_20px_-15px_rgba(0,0,0,0.35)]
        backdrop-blur-sm transition-colors duration-200
      "
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-12 -top-16
          size-28 rounded-full
          bg-(--accent-color)/8 blur-2xl
        "
      />

      {/* Project name + Create */}
      <div className="relative flex items-center gap-1.5">
        <div className="flex size-7 shrink-0 items-center justify-center text-(--accent-color)">
          <FolderPlus size={15} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <input
            type="text"
            aria-label="Project name"
            placeholder="Untitled project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="
              w-full bg-transparent py-0.5
              text-[13px] font-semibold tracking-tight
              text-(--text-primary) outline-none
              placeholder:font-normal
              placeholder:text-(--text-muted)
            "
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="
            inline-flex shrink-0 items-center gap-1
            rounded-md border border-white/10
            bg-(--accent-color) px-2 py-1
            text-[10px] font-semibold text-white
            transition-all duration-200
            hover:brightness-110
            active:scale-[0.97]
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-(--accent-color)
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <Plus size={11} strokeWidth={2.5} />
          Create
        </button>
      </div>

      {/* Divider */}
      <div className="relative h-px bg-white/8" />

      {/* Description */}
      <div className="relative pl-3">
        <input
          type="text"
          aria-label="Project description"
          placeholder="Add a short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="
            w-full min-w-0 bg-transparent py-0.5
            text-[11px] text-(--text-secondary)
            outline-none placeholder:text-(--text-muted)
          "
        />
      </div>

      {/* Footer: deadline + hint */}
      <div className="relative flex flex-col gap-1 pl-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          className="
            -ml-1.5 inline-flex w-full items-center gap-1.5
            rounded-md px-1.5 py-1
            transition-colors hover:bg-white/6
            focus-within:bg-white/6
            sm:w-auto
          "
        >
          <CalendarDays
            size={12}
            className="shrink-0 text-(--accent-color)"
          />
          <input
            type="date"
            aria-label="Project deadline"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="
              min-w-0 flex-1 bg-transparent text-[11px]
              text-(--text-secondary) outline-none
              scheme:dark
              sm:flex-none
            "
          />
        </label>

        <span className="hidden text-[9px] text-(--text-muted) sm:block">
          Press Enter to create
        </span>
      </div>
    </form>
  );
}