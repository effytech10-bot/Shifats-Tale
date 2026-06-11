export interface GalleryItem {
  id: string;
  title: string;
  category: "classroom" | "notes" | "events" | "flyers";
  imageUrl: string;
  description: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Interactive Classroom Session",
    category: "classroom",
    imageUrl: "/images/gallery-classroom.png",
    description: "Visual explanation of Mechanics concepts using 3D simulations in batch."
  },
  {
    id: "gal-2",
    title: "Special Formulas & Handwritten Notes",
    category: "notes",
    imageUrl: "/images/gallery-notes.png",
    description: "Handwritten sheets and shortcut summaries distributed to admission students."
  },
  {
    id: "gal-3",
    title: "Meritorious Students Reception",
    category: "events",
    imageUrl: "/images/gallery-event.png",
    description: "Celebrating admission success and board GPA-5 holders with prizes."
  },
  {
    id: "gal-4",
    title: "Solve Class & Doubt Clearing",
    category: "classroom",
    imageUrl: "/images/gallery-solve.png",
    description: "One-on-one doubt clearing sessions after standard quiz evaluations."
  },
  {
    id: "gal-5",
    title: "HSC-26 & Advanced HSC-27 Batch Flyer",
    category: "flyers",
    imageUrl: "/images/flyer_hsc26_hsc27.jpg",
    description: "Official admission notice for HSC-26 and Advanced HSC-27 regular academic batches."
  },
  {
    id: "gal-6",
    title: "HSC Special Model Test 2025 Flyer",
    category: "flyers",
    imageUrl: "/images/flyer_model_test_2025.png",
    description: "Syllabus-wise model tests and paper final schedules for the HSC-25 & 26 batches."
  },
  {
    id: "gal-7",
    title: "Physics, Chemistry, Math & Engineering Admission Flyer",
    category: "flyers",
    imageUrl: "/images/flyer_admission_science.jpg",
    description: "Engineering pre-admission guidelines and batch features for science group students."
  },
  {
    id: "gal-8",
    title: "HSC Final 2026 Revision Batch Flyer",
    category: "flyers",
    imageUrl: "/images/flyer_revision_2026.jpg",
    description: "HSC board question practice, CQ/MCQ sheets, and full syllabus final revision program."
  }
];

