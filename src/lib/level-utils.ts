export interface LevelInfo {
  current: string;
  next: string;
  threshold: number;
}

export function calculateLevel(accuracy: number): LevelInfo {
  if (accuracy < 25) {
    return { current: "A1.1 Grundstufe", next: "A1.2 Level", threshold: 25 };
  }
  if (accuracy < 50) {
    return { current: "A1.2 Grundstufe", next: "A2.1 Level", threshold: 50 };
  }
  if (accuracy < 75) {
    return { current: "A2.1 Aufbaustufe", next: "A2.2 Level", threshold: 75 };
  }
  if (accuracy < 90) {
    return { current: "A2.2 Aufbaustufe", next: "B1 Mastery", threshold: 90 };
  }
  if (accuracy < 98) {
    return { current: "B1 Fortgeschritten", next: "B2 Mastery", threshold: 98 };
  }
  return { current: "B2 Master Elite", next: "Max Level", threshold: 100 };
}
