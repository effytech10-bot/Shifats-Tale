export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  target: string;
  schedule: string;
  duration: string;
  features: string[];
  whatsappText: string;
}

export const courses: Course[] = [
  {
    id: "ssc-academic",
    title: "SSC Academic Batch",
    subtitle: "Science Core Program",
    description: "Complete board syllabus coverage in Physics, Chemistry, and Mathematics. Laying the ground foundations for higher secondary studies.",
    target: "Class 9 & 10 (Science Candidates)",
    schedule: "3 Days/Week (1.5 Hours per session)",
    duration: "Full Academic Session",
    features: [
      "Textbook theory breakdown",
      "Creative question (CQ) mastery",
      "Solve boards question bank",
      "Weekly test updates to parents"
    ],
    whatsappText: "Hello Sir, I want to inquire about the SSC Academic Batch details."
  },
  {
    id: "hsc-academic",
    title: "HSC Academic Batch",
    subtitle: "Physics & Math Special Care",
    description: "Comprehensive lessons targeting board exams. In-depth concept visualization, extensive formula sheets, and chapter-wise quiz booklets.",
    target: "HSC 2026 & 2027 Candidates",
    schedule: "3 Days/Week (2 Hours per session)",
    duration: "Full Academic Session",
    features: [
      "Core conceptual discussions",
      "Formula roadmaps & hand notes",
      "Weekly structured quizzes",
      "Board paper solve masterclass"
    ],
    whatsappText: "Hello Sir, I want to inquire about the HSC Academic Batch schedules."
  },
  {
    id: "admission-prep",
    title: "Admission Preparation",
    subtitle: "BUET, Varsity & Medical Care",
    description: "Intensive training program to score top ranks in engineering universities, varsity A-unit, and medical admissions. Calculation tips and CQ shortcuts.",
    target: "HSC Candidates (Admission Seekers)",
    schedule: "4 Days/Week (Interactive lectures + Exams)",
    duration: "6 Months Program",
    features: [
      "Past 20 years question banks solving",
      "Mathematical shortcuts & speed tips",
      "BUET standard diagnostic tests",
      "University choice guidelines"
    ],
    whatsappText: "Hello Sir, I would like details about the Admission Preparation program."
  },
  {
    id: "math-special",
    title: "Math Special Batch",
    subtitle: "Higher Mathematics Concept Care",
    description: "Specialized class only for math candidates struggling with core calculus, coordinate geometry, or trigonometric equations.",
    target: "SSC & HSC Science Candidates",
    schedule: "2 Days/Week (Extended sessions)",
    duration: "Ongoing Monthly Program",
    features: [
      "Algebraic & calculus logic breakdown",
      "Step-by-step math proof analysis",
      "Solve advanced workbook problems",
      "Special test checklists"
    ],
    whatsappText: "Hello Sir, I want to inquire about the Math Special Batch slots."
  },
  {
    id: "physics-special",
    title: "Physics Special Batch",
    subtitle: "Advanced Mechanics & Electromagnetism",
    description: "Specialized conceptual program focusing on electricity, magnetism, waves, and mechanics equations using simulated visuals.",
    target: "SSC & HSC Science Candidates",
    schedule: "2 Days/Week (Extended sessions)",
    duration: "Ongoing Monthly Program",
    features: [
      "Simulation-based conceptual lessons",
      "Advanced calculus-based physics",
      "Challenging engineering problems solve",
      "Formula derivation notes"
    ],
    whatsappText: "Hello Sir, I want to inquire about the Physics Special Batch schedules."
  },
  {
    id: "crash-course",
    title: "Revision Crash Course",
    subtitle: "Final Board Revision Program",
    description: "Fast-track syllabus review program launched 3 months before board exams to solve test papers and identify weak concepts.",
    target: "SSC & HSC Exam Candidates",
    schedule: "4 Days/Week (Revision classes + Daily exams)",
    duration: "3 Months Program",
    features: [
      "Express syllabus speed-run",
      "High-yield board topics selection",
      "Full board mock diagnostic tests",
      "Last-minute prep worksheets"
    ],
    whatsappText: "Hello Sir, please let me know details of the upcoming Revision Crash Course."
  }
];
