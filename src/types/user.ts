export type Gender = "male" | "female";

export interface User {
  id: string;
  name: string;
  email: string;
  gender?: Gender | null;
  avatarId?: number | null;
}
