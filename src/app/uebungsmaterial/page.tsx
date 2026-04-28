import { Metadata } from "next";
import { ExerciseDownloadView } from "@/components/exercises/exercise-download-view";

export const metadata: Metadata = {
  title: "Übungs-Generator — EgalDeutsch",
  description: "Erstelle und lade dir individuelle PDF-Übungsblätter zum Deutschlernen herunter. Wähle Thema, Niveau und Umfang.",
  alternates: {
    canonical: "/uebungsmaterial",
  },
};

export default function ExercisesPage() {
  return <ExerciseDownloadView />;
}
