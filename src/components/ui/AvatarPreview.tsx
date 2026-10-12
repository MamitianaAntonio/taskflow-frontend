import { useMemo } from "react";
import Avatar from "react-nice-avatar";
import type { Gender } from "../../types/user";
import { genAvatarConfig } from "../../utils/avatar";

interface AvatarPreviewProps {
  seed: string;
  gender?: Gender | null;
  className?: string;
  shape?: "circle" | "rounded" | "square";
}

// renders a single avatar from a seed + gender (no user needed)
const AvatarPreview = ({
  seed,
  gender,
  className,
  shape = "rounded",
}: AvatarPreviewProps) => {
  const config = useMemo(() => genAvatarConfig(seed, gender), [seed, gender]);

  return <Avatar className={className} shape={shape} {...config} />;
};

export default AvatarPreview;
