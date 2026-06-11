export interface YouTubeClass {
  id: string;
  title: string;
  topic: string;
  embedId: string;
  duration: string;
  views?: string;
}

export const youtubeClasses: YouTubeClass[] = [
  {
    id: "yt-1",
    title: "Newtonian Mechanics: Friction & Slanted Planes (Concept Class)",
    topic: "HSC Physics - Newtonian Mechanics",
    embedId: "dQw4w9WgXcQ", // Standard placeholder video
    duration: "45 mins",
    views: "12K+ views"
  },
  {
    id: "yt-2",
    title: "Calculus for Beginners: Integration Made Easy",
    topic: "HSC Higher Math - Calculus",
    embedId: "dQw4w9WgXcQ",
    duration: "1 hr 15 mins",
    views: "8.5K+ views"
  },
  {
    id: "yt-3",
    title: "Vector Operations & River-Boat Math Challenges",
    topic: "HSC Physics - Vector",
    embedId: "dQw4w9WgXcQ",
    duration: "55 mins",
    views: "15K+ views"
  },
  {
    id: "yt-4",
    title: "Complex Numbers - Shortcuts for Admission Tests",
    topic: "Admission Math",
    embedId: "dQw4w9WgXcQ",
    duration: "38 mins",
    views: "9.2K+ views"
  }
];
