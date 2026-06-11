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
    id: "hsc-academic",
    title: "HSC Academic Program",
    subtitle: "Physics & Higher Mathematics Special Care",
    description: "Complete academic syllabus coverage according to board standards. Focused on building conceptual depth followed by rigorous problem-solving from textbook and test papers.",
    target: "HSC 2026 & 2027 Batches",
    schedule: "3 Days/Week (2 Hours per session)",
    duration: "Full Academic Session",
    features: [
      "Conceptual discussion from basic to advanced levels",
      "Chapter-wise hand notes and formula sheets",
      "Regular weekly quizzes & monthly descriptive exams",
      "Special doubt-clearing sessions before board exams",
      "Continuous student performance tracking"
    ],
    whatsappText: "Hello Sir, I'm interested in the HSC Academic Program. Please let me know the details of the upcoming batches."
  },
  {
    id: "varsity-admission",
    title: "University & Engineering Admission Care",
    subtitle: "Pre-Admission + Admission Preparation",
    description: "Targeted course to crack admission tests of BUET, RUET, KUET, CUET, Dhaka University (A-Unit), and other public universities. Fast calculation tricks, conceptual shortcuts, and CQ solving strategies.",
    target: "HSC Candidates (Admission Seekers)",
    schedule: "4 Days/Week (Interactive lectures + Exams)",
    duration: "6 Months Intensive Program",
    features: [
      "Rigorous discussion of BUET & DU past 20 years question banks",
      "Advanced mathematical short-cuts and time-management tips",
      "Weekly admission-style standard tests (both CQ & MCQ)",
      "Exclusive PDF lectures and standard sheet booklet",
      "Personalized mentorship and university choice guidelines"
    ],
    whatsappText: "Hello Sir, I want to inquire about the University & Engineering Admission Care batch."
  },
  {
    id: "ssc-academic",
    title: "SSC Academic Care",
    subtitle: "Science Group Core subjects",
    description: "Laying a solid foundation in Physics, Chemistry, and General/Higher Mathematics. Bridging the gap between secondary conceptual basics and college prerequisites.",
    target: "SSC 2026 & 2027 Science Students",
    schedule: "3 Days/Week (1.5 Hours per session)",
    duration: "Full Academic Session",
    features: [
      "In-depth breakdown of textbook theories",
      "Creative Question (CQ) and MCQ pattern mastery",
      "Solving board question banks from top schools",
      "Weekly assessment and parents update feedback",
      "Interactive and visual learning techniques"
    ],
    whatsappText: "Hello Sir, I want to register my child/myself for the SSC Academic Care batch. Please share the details."
  },
  {
    id: "physics-special",
    title: "Physics Masterclass",
    subtitle: "Exclusive Concept Builder Program",
    description: "A highly specialized program designed only for students who struggle with core physics concepts or wish to prepare ahead for national olympiads and premium university exams.",
    target: "HSC Science Students",
    schedule: "2 Days/Week (Extended sessions)",
    duration: "Ongoing Monthly Program",
    features: [
      "Visualization of physical laws using simulations",
      "Advanced calculus-based physics explanations",
      "Solving challenging problems from Irodov and university standard materials",
      "Specialized focus on electricity, magnetism, and magnetism"
    ],
    whatsappText: "Hello Sir, I'm interested in joining the Physics Masterclass. Please let me know the schedule."
  }
];
