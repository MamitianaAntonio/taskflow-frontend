import { useState } from "react";
import { notify } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMars,
  faVenus,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import useUserStore from "../../stores/userStore";
import { updateUserAvatar, updateUserGender } from "../../services/user";
import type { Gender } from "../../types/user";
import {
  AVATAR_VARIANT_COUNT,
  avatarVariantSeed,
  baseSeedOf,
} from "../../utils/avatar";
import OptionChips, { type OptionChip } from "../ui/OptionChips";
import AvatarPreview from "../ui/AvatarPreview";

const GENDER_OPTIONS: OptionChip<Gender>[] = [
  { value: "male", label: "Male", icon: faMars },
  { value: "female", label: "Female", icon: faVenus },
];

const VARIANTS = Array.from({ length: AVATAR_VARIANT_COUNT }, (_, i) => i);

export default function AvatarPicker() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [saving, setSaving] = useState(false);

  const gender = user?.gender ?? null;
  const avatarId = user?.avatarId ?? 0;
  const baseSeed = baseSeedOf(user);

  const selectGender = async (next: Gender) => {
    if (!user || next === user.gender) return;
    const previous = user;
    setSaving(true);
    setUser({ ...user, gender: next }); // optimistic
    try {
      const updated = await updateUserGender(next);
      setUser({ ...user, ...updated, gender: next });
      notify.success("Gender updated");
    } catch (error) {
      setUser(previous);
      notify.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const selectAvatar = async (next: number) => {
    if (!user || next === user.avatarId) return;
    const previous = user;
    setSaving(true);
    setUser({ ...user, avatarId: next }); // optimistic
    try {
      const updated = await updateUserAvatar(next);
      setUser({ ...user, ...updated, avatarId: next });
      notify.success("Avatar updated");
    } catch (error) {
      setUser(previous);
      notify.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-(--border-color) bg-(--bg-primary) px-4 py-3">
        <AvatarPreview
          seed={avatarVariantSeed(baseSeed, avatarId)}
          gender={gender}
          className="size-16 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <OptionChips
            label={
              <>
                <FontAwesomeIcon
                  icon={faVenusMars}
                  className="text-[10px] text-(--accent-color)"
                />
                Gender
              </>
            }
            options={GENDER_OPTIONS}
            value={gender as Gender}
            onChange={selectGender}
            variant="tabs"
            name="gender"
            disabled={!user || saving}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 font-interface text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
          Choose an avatar
        </p>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((id) => {
            const selected = id === avatarId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectAvatar(id)}
                disabled={!user || saving}
                aria-label={`Avatar ${id + 1}`}
                aria-pressed={selected}
                className={`relative size-10 shrink-0 overflow-hidden rounded-lg border p-0.5 transition-all disabled:cursor-not-allowed sm:size-11 ${
                  selected
                    ? "border-(--accent-color) ring-2 ring-(--accent-color)"
                    : "border-(--border-color) hover:border-(--accent-color)"
                }`}
              >
                <AvatarPreview
                  seed={avatarVariantSeed(baseSeed, id)}
                  gender={gender}
                  className="h-full w-full"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
