/**
 * YouTube Lectures / Free Classes Data Configuration
 * 
 * Edit this file to add links to YouTube concept classes.
 * You can customize the title, subject, chapter, teacher, duration, thumbnail path, and YouTube URL.
 */

export interface YouTubeClass {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  teacher: string;
  duration: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  
  // Keep for backward compatibility with UI
  topic: string;
  embedId: string;
  views?: string;
}

export const youtubeClasses: YouTubeClass[] = [
  {
    id: "yt-1",
    title: "1. Why Imaginary Number? | Complex Number | MATH",
    subject: "Higher Math",
    chapter: "Complex Numbers",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "32 mins",
    thumbnailUrl: "/images/gallery-classroom.png",
    youtubeUrl: "https://www.youtube.com/watch?v=U62mF8R0S8o",
    topic: "HSC Higher Math - Complex Numbers",
    embedId: "U62mF8R0S8o",
    views: "9.4K+ views"
  },
  {
    id: "yt-2",
    title: "বেনজিন সংযোজন বিক্রিয়া | এরোমেটিক হাইড্রোকার্বন | জৈব রসায়ন",
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "45 mins",
    thumbnailUrl: "/images/gallery-notes.png",
    youtubeUrl: "https://www.youtube.com/watch?v=D6D6b1EaW50",
    topic: "HSC Chemistry - Organic Chemistry",
    embedId: "D6D6b1EaW50",
    views: "7.2K+ views"
  },
  {
    id: "yt-3",
    title: "জারক বিজারক ম্যাথ-০৩ | পরিমাণগত রসায়ন | MD. ZIAUDDIN SIFAT",
    subject: "Chemistry",
    chapter: "Quantitative Chemistry",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "50 mins",
    thumbnailUrl: "/images/gallery-solve.png",
    youtubeUrl: "https://www.youtube.com/watch?v=F3_6Q_K7zJ8",
    topic: "HSC Chemistry - Quantitative Chemistry",
    embedId: "F3_6Q_K7zJ8",
    views: "12K+ views"
  },
  {
    id: "yt-4",
    title: "বৃ‌ত্তের বি‌শেষ সমীকরণ | বু‌য়েট ১৯-২০ প্রশ্ন সমাধান | CIRCLE BUET",
    subject: "Higher Math",
    chapter: "Circle",
    teacher: "Md. Zia Uddin Azad Sifat",
    duration: "38 mins",
    thumbnailUrl: "/images/gallery-event.png",
    youtubeUrl: "https://www.youtube.com/watch?v=D_y3gK2qW4s",
    topic: "Admission Math - Circles",
    embedId: "D_y3gK2qW4s",
    views: "15K+ views"
  }
];
