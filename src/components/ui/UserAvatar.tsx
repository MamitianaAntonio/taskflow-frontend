import type { User } from "../../types/user";
import { avatarVariantSeed, baseSeedOf } from "../../utils/avatar";
import AvatarPreview from "./AvatarPreview";

interface UserAvatarProps {
  user: User | null;
  className?: string;
  shape?: "circle" | "rounded" | "square";
}

// the user's chosen avatar, deterministic from their account
const UserAvatar = ({
  user,
  className,
  shape = "rounded",
}: UserAvatarProps) => (
  <AvatarPreview
    seed={avatarVariantSeed(baseSeedOf(user), user?.avatarId ?? 0)}
    gender={user?.gender}
    className={className}
    shape={shape}
  />
);

export default UserAvatar;
