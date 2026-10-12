import { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import type { Gender, User } from "../types/user";

// how many avatars are offered in the picker
export const AVATAR_VARIANT_COUNT = 8;

const sexOf = (gender?: Gender | null): "man" | "woman" | undefined => {
  if (gender === "male") return "man";
  if (gender === "female") return "woman";
  return undefined;
};

// stable per-user seed (email is unique)
export const baseSeedOf = (user: User | null): string =>
  user?.email ?? user?.name ?? (user?.id != null ? String(user.id) : "guest");

// each variant is a different avatar for the same user
export const avatarVariantSeed = (baseSeed: string, avatarId: number): string =>
  `${baseSeed}:${avatarId}`;

// genConfig is deterministic from a seed but the sex is drawn at random.
// Re-hash the seed until we get the wanted sex, so the hairStyle stays coherent.
export const genAvatarConfig = (
  seed: string,
  gender?: Gender | null,
): AvatarFullConfig => {
  const sex = sexOf(gender);
  if (!sex) return genConfig(seed);

  for (let i = 0; i < 25; i++) {
    const config = genConfig(`${seed}:${sex}:${i}`);
    if (config.sex === sex) return config;
  }
  return genConfig(`${seed}:${sex}`);
};
