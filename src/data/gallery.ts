export interface GalleryItem {
  id: string;
  title: string;
  category: "classroom" | "notes" | "events";
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
  }
];
