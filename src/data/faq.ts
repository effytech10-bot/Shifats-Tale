export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Where is the physical coaching center located?",
    answer: "Our main offline facility is situated at a highly accessible spot in Dhaka (e.g., Farmgate / Lalmatia, near leading colleges). Exact floor details and directions can be found in the Location section below or sent via WhatsApp."
  },
  {
    id: "faq-2",
    question: "How does Shifat Sir monitor student progress?",
    answer: "We conduct chapter-wise written quizzes and monthly comprehensive board-standard exams. Answer scripts are graded personally by Shifat Sir with comments, and marks are shared directly with parents via SMS/WhatsApp alerts. Inactive performance triggers a feedback call with parents."
  },
  {
    id: "faq-3",
    question: "What happens if a student misses a lecture?",
    answer: "Every critical conceptual lecture is recorded and archived. If a student misses a class due to sickness or unavoidable emergencies, they can request the lecture recording and schedule a short 1-on-1 doubt clearing session with Sir during slot hours."
  },
  {
    id: "faq-4",
    question: "Is there any batch size limit?",
    answer: "Yes, we prioritize quality over quantity. To ensure that Shifat Sir can monitor every single student, each batch is strictly capped at a maximum of 25-30 students."
  },
  {
    id: "faq-5",
    question: "How can parents communicate with Shifat Sir?",
    answer: "Parents can directly schedule a call or meet Sir during designated consulting hours (typically between 5:00 PM and 6:30 PM on scheduled days). Continuous communication keeps students accountable."
  }
];
