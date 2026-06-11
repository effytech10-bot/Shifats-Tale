export interface StudentResult {
  id: string;
  name: string;
  college: string;
  achievement: string;
  examType: "Engineering" | "University" | "Medical" | "Board";
  year: string;
}

export const studentResults: StudentResult[] = [
  {
    id: "res-1",
    name: "Ayon Sen",
    college: "Notre Dame College",
    achievement: "BUET - Merit Position 42 (Mechanical)",
    examType: "Engineering",
    year: "2024"
  },
  {
    id: "res-2",
    name: "Samiul Huq",
    college: "Dhaka College",
    achievement: "Dhaka University - Merit Position 112 (A Unit)",
    examType: "University",
    year: "2024"
  },
  {
    id: "res-3",
    name: "Nusrat Jahan",
    college: "Holy Cross College",
    achievement: "Mymensingh Medical College (Admission)",
    examType: "Medical",
    year: "2024"
  },
  {
    id: "res-4",
    name: "Ishtiaq Ahmed",
    college: "Notre Dame College",
    achievement: "HSC Board - GPA 5.00 (Physics: 100/100)",
    examType: "Board",
    year: "2024"
  },
  {
    id: "res-5",
    name: "Mehrab Hossain",
    college: "St. Joseph Higher Secondary School",
    achievement: "IUT - Merit Position 89 (CSE)",
    examType: "Engineering",
    year: "2024"
  },
  {
    id: "res-6",
    name: "Zarin Subah",
    college: "Viqarunnisa Noon College",
    achievement: "HSC Board - GPA 5.00 (Math: 98/100)",
    examType: "Board",
    year: "2024"
  }
];
