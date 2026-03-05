export type CatchWithRelations = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  species: string;
  weightLbs: number | null;
  lengthIn: number | null;
  location: string | null;
  photos: string[];
  caughtAt: Date;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
  gear: GearItem[];
  waterConditions: WaterConditionsData | null;
};

export type GearItem = {
  id: string;
  catchId: string;
  type: string;
  brand: string | null;
  model: string | null;
  description: string | null;
};

export type WaterConditionsData = {
  id: string;
  catchId: string;
  tempF: number | null;
  clarity: string | null;
  depthFt: number | null;
  currentSpeed: string | null;
  weather: string | null;
  airTempF: number | null;
  windMph: number | null;
  notes: string | null;
};

export type PostWithUser = {
  id: string;
  userId: string;
  title: string;
  content: string;
  photos: string[];
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
};
