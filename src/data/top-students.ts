export interface TopStudent {
  id: string;
  name: string;
  college: string;
  batch: string;
  image: string;
  achievement: string;
  score: string;
}

export interface TopMonthData {
  id: string;
  monthName: string;
  students: TopStudent[];
}

export const topStudentsData: TopMonthData[] = [
  {
    id: "june-2026",
    monthName: "June 2026",
    students: [
      {
        id: "student-1",
        name: "Abir Hossain",
        college: "Chittagong College",
        batch: "HSC First Year 2027",
        image: "/images/s1.jpeg",
        achievement: "Highest Mark in Mechanics",
        score: "98/100"
      },
      {
        id: "student-2",
        name: "Sadia Afrin",
        college: "Govt. Hazi Mohammad Mohsin College",
        batch: "HSC Second Year 2026",
        image: "/images/s2.jpeg",
        achievement: "Top in Physics Grand Test",
        score: "195/200"
      }
    ]
  },
  {
    id: "may-2026",
    monthName: "May 2026",
    students: [
      {
        id: "student-3",
        name: "Rahim Uddin",
        college: "Chittagong Govt. City College",
        batch: "HSC First Year 2027",
        image: "/images/s3.jpeg",
        achievement: "Highest in Vectors",
        score: "95/100"
      },
      {
        id: "student-4",
        name: "Samiha Zaman",
        college: "Cantonment English School & College",
        batch: "HSC Second Year 2026",
        image: "/images/s4.jpeg",
        achievement: "Best Performar in Optics",
        score: "99/100"
      }
    ]
  },
  {
    id: "april-2026",
    monthName: "April 2026",
    students: [
      {
        id: "student-5",
        name: "Tanvir Rahman",
        college: "Chittagong College",
        batch: "HSC First Year 2027",
        image: "/images/s5.jpeg",
        achievement: "Highest Mark in Work & Energy",
        score: "97/100"
      },
      {
        id: "student-6",
        name: "Ayesha Siddiqa",
        college: "BAF Shaheen College",
        batch: "HSC Second Year 2026",
        image: "/images/s1.jpeg",
        achievement: "Top in Calculus",
        score: "100/100"
      }
    ]
  }
];
