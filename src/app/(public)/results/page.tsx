import { Metadata } from "next";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = {
  title: "Success Stories & Alumni | Shifat's Tales",
  description: "Explore the brilliant minds who have achieved top ranks in board exams and university admissions with Shifat's Tales.",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
