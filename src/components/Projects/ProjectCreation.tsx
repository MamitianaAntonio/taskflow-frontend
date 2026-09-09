import type { FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderBlank } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

interface ProjectCreationProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  handleCreate: (e: FormEvent) => void;
}

export default function ProjectCreation({
  name,
  setName,
  description,
  setDescription,
  handleCreate,
}: ProjectCreationProps) {
  return (
    <form
      onSubmit={handleCreate}
      className="rounded-xl border border-(--border-color) bg-(--bg-secondary) px-4 py-3 transition-all focus-within:border-(--accent-muted)"
    >
      <div className="flex items-center gap-2.5">
        <FontAwesomeIcon
          icon={faFolderBlank}
          className="shrink-0 text-sm text-(--text-muted)"
        />
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-(--text-primary) outline-none placeholder:font-normal placeholder:text-(--text-muted)"
        />
        <Button
          variant="outline"
          size="small"
          type="submit"
          text="Create"
          disabled={!name.trim()}
        />
      </div>
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-2 w-full border-t border-(--border-color) bg-transparent pt-2 text-xs text-(--text-secondary) outline-none placeholder:text-(--text-muted)"
      />
    </form>
  );
}