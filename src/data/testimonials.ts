/**
 * Testimonials Data Configuration
 * 
 * Edit this file to customize reviews and ratings from parents and students.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: "Student" | "Parent";
  message: string;
  quote: string; // Keep for backward compatibility with UI
  rating: number; // 1 to 5 stars
  image: string; // Path to student avatar or fallback
  batch: string;
  achievement?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Adib Hasan",
    role: "Student",
    message: "Shifat Sir has an extraordinary way of explaining complex physics concepts. Before joining his batch, I used to memorize formulas, but he taught me how to derive and visualize them. His hand notes are gold for admission tests!",
    quote: "Shifat Sir has an extraordinary way of explaining complex physics concepts. Before joining his batch, I used to memorize formulas, but he taught me how to derive and visualize them. His hand notes are gold for admission tests!",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2024",
    achievement: "Currently studying at BUET (CSE)"
  },
  {
    id: "test-2",
    name: "Dr. Farhana Yasmin",
    role: "Parent",
    message: "As a doctor, I wanted my son to have a strong conceptual foundation rather than just cramming for exams. Shifat Sir's personal monitoring, regular test updates, and constant encouragement completely changed Abrar's attitude towards Mathematics.",
    quote: "As a doctor, I wanted my son to have a strong conceptual foundation rather than just cramming for exams. Shifat Sir's personal monitoring, regular test updates, and constant encouragement completely changed Abrar's attitude towards Mathematics.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "Mother of Abrar (SSC Batch 2025)",
    achievement: "Abrar got GPA 5.00"
  },
  {
    id: "test-3",
    name: "Tahmina Chowdhury",
    role: "Student",
    message: "Even though I was preparing for medical school, Sir's Physics batches helped me immensely. His techniques for solving math quickly saved me critical time in the DMC admission test. He is a mentor who checks up on every single student.",
    quote: "Even though I was preparing for medical school, Sir's Physics batches helped me immensely. His techniques for solving math quickly saved me critical time in the DMC admission test. He is a mentor who checks up on every single student.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2024",
    achievement: "Dhaka Medical College (DMC)"
  },
  {
    id: "test-4",
    name: "Saadman Rahman",
    role: "Student",
    message: "Sir's weekly assessment tests are challenging, but they prepare you perfectly for any exam standard. He never hesitates to explain the same topic 5 times if you don't understand it. Best teacher I have ever met.",
    quote: "Sir's weekly assessment tests are challenging, but they prepare you perfectly for any exam standard. He never hesitates to explain the same topic 5 times if you don't understand it. Best teacher I have ever met.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2025",
    achievement: "Physics Board Mark: 98/100"
  },
  {
    id: "test-5",
    name: "Nabila Sajjad",
    role: "Student",
    message: "Sir's mathematical physics shortcut derivations and coordinate geometry summaries saved my admission exam time. I managed to solve all problems and got into RUET EEE!",
    quote: "Sir's mathematical physics shortcut derivations and coordinate geometry summaries saved my admission exam time. I managed to solve all problems and got into RUET EEE!",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2023",
    achievement: "Got into RUET (EEE)"
  },
  {
    id: "test-6",
    name: "Kamrul Islam",
    role: "Parent",
    message: "Fahim was struggling with mechanics in physics class. After joining Shifat Sir's core care batch, his analytical skills improved significantly. He succeeded in board exams and got admitted into CUET.",
    quote: "Fahim was struggling with mechanics in physics class. After joining Shifat Sir's core care batch, his analytical skills improved significantly. He succeeded in board exams and got admitted into CUET.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "Father of Fahim (HSC Batch 2024)",
    achievement: "Fahim got into CUET"
  },
  {
    id: "test-7",
    name: "Farhan Labib",
    role: "Student",
    message: "Higher Mathematics calculus was a nightmare for me until I did the differentiation and integration visual breakdown sessions with Sifat Sir. His graphical representation was superb.",
    quote: "Higher Mathematics calculus was a nightmare for me until I did the differentiation and integration visual breakdown sessions with Sifat Sir. His graphical representation was superb.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2025",
    achievement: "Board Exam Math A+"
  },
  {
    id: "test-8",
    name: "Jannatul Fiza",
    role: "Student",
    message: "The strict diagnostic test rankings and parent notification system kept me serious and focused throughout my HSC prep. I am extremely proud to say I got admitted into DU A-Unit!",
    quote: "The strict diagnostic test rankings and parent notification system kept me serious and focused throughout my HSC prep. I am extremely proud to say I got admitted into DU A-Unit!",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "HSC Batch 2024",
    achievement: "Got into Dhaka University (DU)"
  },
  {
    id: "test-9",
    name: "Maisha Anjum",
    role: "Student",
    message: "I got board A+ in all science core subjects. Sir's creative questions (CQ) and MCQ speed-drills prepared me to manage exam stress without panicking.",
    quote: "I got board A+ in all science core subjects. Sir's creative questions (CQ) and MCQ speed-drills prepared me to manage exam stress without panicking.",
    rating: 5,
    image: "/images/shifat_sir.png",
    batch: "SSC Batch 2024",
    achievement: "SSC Board GPA 5.00"
  }
];
