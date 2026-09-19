export type Account = {
  id: string;
  username: string;
  minecraftUuid: string;
  createdAt?: string;
  playtimeSeconds?: string;
  playtimeUpdatedAt?: string | null;
  points: string;
  roles: {role: string; expires_at: string | null}[];
  grades: {grade: string; expires_at: string}[];
};
