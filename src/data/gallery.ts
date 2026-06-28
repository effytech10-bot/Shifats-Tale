/**
 * Gallery Items Data Configuration & Architecture Adapter
 * 
 * Edit this file to add or update images in the gallery layout.
 * Provides dynamic data selectors, filtering, sorting, and safe fallback logic
 * for both the homepage preview and the dedicated /gallery route.
 */

export type GalleryCategory = "classroom" | "notes" | "events" | "flyers";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  imageUrl: string; // Keep for backward compatibility with UI components
  description: string;
  alt?: string;
  date?: string;
  featured?: boolean;
  displayOrder?: number;
  albumSize?: number;
  status?: "published" | "draft";
}

export interface GalleryCategoryMeta {
  label: string;
  value: GalleryCategory | "All";
  description?: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [
  { label: "Show All", value: "All" },
  { label: "Coaching Flyers", value: "flyers" },
  { label: "Classroom Life", value: "classroom" },
  { label: "Lecture Sheets & Notes", value: "notes" },
  { label: "Events & Awards", value: "events" },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Interactive Classroom Session",
    category: "classroom",
    image: "/images/gallery-classroom.png",
    imageUrl: "/images/gallery-classroom.png",
    description: "Visual explanation of Mechanics concepts using 3D simulations in batch.",
    alt: "Students attending interactive physics classroom session at Shifat's Tales",
    date: "2026-05-12",
    featured: true,
    displayOrder: 1,
    albumSize: 12
  },
  {
    id: "gal-2",
    title: "Special Formulas & Handwritten Notes",
    category: "notes",
    image: "/images/gallery-notes.png",
    imageUrl: "/images/gallery-notes.png",
    description: "Handwritten sheets and shortcut summaries distributed to admission students.",
    alt: "Handwritten physics formula sheet for HSC and admission prep",
    date: "2026-05-18",
    featured: false,
    displayOrder: 2,
    albumSize: 8
  },
  {
    id: "gal-3",
    title: "Meritorious Students Reception",
    category: "events",
    image: "/images/gallery-event.png",
    imageUrl: "/images/gallery-event.png",
    description: "Celebrating admission success and board GPA-5 holders with prizes.",
    alt: "Award ceremony celebrating meritorious students at Shifat's Tales",
    date: "2026-06-01",
    featured: true,
    displayOrder: 3,
    albumSize: 24
  },
  {
    id: "gal-4",
    title: "Solve Class & Doubt Clearing",
    category: "classroom",
    image: "/images/gallery-solve.png",
    imageUrl: "/images/gallery-solve.png",
    description: "One-on-one doubt clearing sessions after standard quiz evaluations.",
    alt: "Instructor resolving student questions during solve class session",
    date: "2026-06-10",
    featured: false,
    displayOrder: 4,
    albumSize: 6
  },
  {
    id: "gal-5",
    title: "HSC-26 & Advanced HSC-27 Batch Flyer",
    category: "flyers",
    image: "/images/flyer_hsc26_hsc27.jpg",
    imageUrl: "/images/flyer_hsc26_hsc27.jpg",
    description: "Official admission notice for HSC-26 and Advanced HSC-27 regular academic batches.",
    alt: "Admission notice flyer for HSC 26 and 27 batches",
    date: "2026-06-15",
    featured: true,
    displayOrder: 5,
    albumSize: 4
  },
  {
    id: "gal-6",
    title: "HSC Special Model Test 2025 Flyer",
    category: "flyers",
    image: "/images/flyer_model_test_2025.png",
    imageUrl: "/images/flyer_model_test_2025.png",
    description: "Syllabus-wise model tests and paper final schedules for the HSC-25 & 26 batches.",
    alt: "HSC Model test schedule flyer",
    date: "2026-06-20",
    featured: false,
    displayOrder: 6,
    albumSize: 2
  },
  {
    id: "gal-7",
    title: "Physics, Chemistry, Math & Engineering Admission Flyer",
    category: "flyers",
    image: "/images/flyer_admission_science.jpg",
    imageUrl: "/images/flyer_admission_science.jpg",
    description: "Engineering pre-admission guidelines and batch features for science group students.",
    alt: "Engineering admission preparation program flyer",
    date: "2026-06-22",
    featured: false,
    displayOrder: 7,
    albumSize: 3
  },
  {
    id: "gal-8",
    title: "HSC Final 2026 Revision Batch Flyer",
    category: "flyers",
    image: "/images/flyer_revision_2026.jpg",
    imageUrl: "/images/flyer_revision_2026.jpg",
    description: "HSC board question practice, CQ/MCQ sheets, and full syllabus final revision program.",
    alt: "Revision batch admission announcement flyer",
    date: "2026-06-25",
    featured: false,
    displayOrder: 8,
    albumSize: 5
  }
];

// ============================================================================
// Data Selectors and Safe Helpers
// ============================================================================

/**
 * Get configured homepage preview subset safely
 */
export function getHomepageGalleryPreview(limit = 5): GalleryItem[] {
  const published = galleryItems.filter(item => item.status !== "draft");
  const sorted = [...published].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  return sorted.slice(0, limit);
}

/**
 * Get genuine featured stories safely
 */
export function getFeaturedGalleryItems(): GalleryItem[] {
  return galleryItems.filter(item => item.featured && item.status !== "draft");
}

/**
 * Resolve display label for categories cleanly
 */
export function getCategoryLabel(category: string): string {
  switch (category) {
    case "flyers":
      return "Coaching Flyer";
    case "classroom":
      return "Classroom Life";
    case "notes":
      return "Lecture Sheets & Notes";
    case "events":
      return "Events & Awards";
    default:
      return category;
  }
}

/**
 * Filter & Sort helper for full gallery query operations without mutating state
 */
export interface GalleryQueryOptions {
  category?: GalleryCategory | "All";
  search?: string;
  sort?: "latest" | "oldest" | "default";
}

export function queryGalleryItems(options: GalleryQueryOptions = {}): GalleryItem[] {
  const { category = "All", search = "", sort = "default" } = options;

  let result = galleryItems.filter(item => item.status !== "draft");

  // Category filter
  if (category !== "All") {
    result = result.filter(item => item.category === category);
  }

  // Search query filter (title, description, category)
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        getCategoryLabel(item.category).toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === "latest") {
    result = [...result].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
  } else if (sort === "oldest") {
    result = [...result].sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
  } else {
    // Default display order
    result = [...result].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  }

  return result;
}
