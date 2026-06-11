export interface Testimonial {
  id: string;
  name: string;
  role: "Student" | "Parent";
  batch: string;
  achievement?: string;
  quote: string;
  avatarUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Adib Hasan",
    role: "Student",
    batch: "HSC Batch 2024",
    achievement: "Currently studying at BUET (CSE)",
    quote: "Shifat Sir has an extraordinary way of explaining complex physics concepts. Before joining his batch, I used to memorize formulas, but he taught me how to derive and visualize them. His hand notes are gold for admission tests!"
  },
  {
    id: "test-2",
    name: "Dr. Farhana Yasmin",
    role: "Parent",
    batch: "Mother of Abrar (SSC Batch 2025)",
    achievement: "Abrar got GPA 5.00",
    quote: "As a doctor, I wanted my son to have a strong conceptual foundation rather than just cramming for exams. Shifat Sir's personal monitoring, regular test updates, and constant encouragement completely changed Abrar's attitude towards Mathematics."
  },
  {
    id: "test-3",
    name: "Tahmina Chowdhury",
    role: "Student",
    batch: "HSC Batch 2024",
    achievement: "Dhaka Medical College (DMC)",
    quote: "Even though I was preparing for medical school, Sir's Physics batches helped me immensely. His techniques for solving math quickly saved me critical time in the DMC admission test. He is a mentor who checks up on every single student."
  },
  {
    id: "test-4",
    name: "Saadman Rahman",
    role: "Student",
    batch: "HSC Batch 2025",
    achievement: "Physics Board Mark: 98/100",
    quote: "Sir's weekly assessment tests are challenging, but they prepare you perfectly for any exam standard. He never hesitates to explain the same topic 5 times if you don't understand it. Best teacher I have ever met."
  }
];
