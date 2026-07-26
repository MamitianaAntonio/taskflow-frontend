import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderBlank } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

export default function ProjectCreation({
  name,
  setName,
  handleCreate,
  description,
  setDescription,
}) {
  return (
    <form
      onSubmit={handleCreate}
      className="rounded-xl border border-(--border-color) bg-(--bg-secondary)
       px-4 py-3 focus-within:border-(--accent-color) focus-within:bg-(--accent-bg)/30 transition-all"
    >
      <div className="flex items-center gap-2.5">
        <FontAwesomeIcon
          icon={faFolderBlank}
          className="text-sm shrink-0 text-(--text-muted)"
        />
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="flex-1 min-w-0 bg-transparent text-sm font-medium text-(--text-primary)
           placeholder:text-(--text-muted) placeholder:font-normal
           outline-none placeholder:transition-colors focus:placeholder:text-(--accent-color)/60"
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
        className="mt-2 w-full bg-transparent text-xs text-(--text-secondary)
         placeholder:text-(--text-muted) outline-none border-t border-(--border-color) pt-2"
      />
    </form>
  );
}
