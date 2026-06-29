/**
 * About & Academic Portfolio Data Model Adapter
 * 
 * Centralized dynamic data repository for Shifat Sir's Academic Portfolio (/about).
 * All UI components consume these structured entities to remain 100% database-ready.
 */

export interface HeroStat {
  iconName: "GraduationCap" | "Users" | "Youtube" | "MapPin";
  label: string;
  value: string;
  subValue: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName: "Facebook" | "Instagram" | "Youtube" | "Linkedin" | "Twitter";
}

export interface ProfileInfo {
  name: string;
  role: string;
  organization: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  imageUrl: string;
  greeting?: string;
  subtitle?: string;
  quote?: string;
  heroStats?: HeroStat[];
  socialLinks?: SocialLink[];
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  iconName: "GraduationCap" | "UserCheck" | "BookOpen" | "Award" | "Code";
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  status?: string;
  displayOrder: number;
}

export interface ResearchThesis {
  type: string;
  supervisor: string;
  coSupervisors: string[];
  title: string;
  keyFindings: string[];
}

export interface PublicationItem {
  id: string;
  type: "Journal" | "Conference";
  title: string;
  venue?: string;
  authors?: string;
  year?: string;
  link?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  iconName: string;
  technologies?: string[];
  link?: string;
  displayOrder: number;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface TrainingItem {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
  certificateUrl?: string;
}

export const profileData: ProfileInfo = {
  name: "Md. Zia Uddin Azad Sifat",
  role: "CEO AT SHIFAT'S TALES",
  organization: "ACADEMIC & ADMISSION CARE",
  summary: "I help students build strong academic foundations while developing a consistent Islamic lifestyle. Learning with purpose. Living with tawakkul.",
  email: "ziauddin.sifat@cuet.ac.bd",
  phone: "+880 1879-169446",
  location: "Chattogram, Bangladesh",
  imageUrl: "/images/sir_photo_clean.png",
  greeting: "Assalamu Alaikum, I'm",
  subtitle: "Academic & Islamic Lifestyle Mentor",
  quote: "Seeking knowledge is an obligation, implementing it is true success.",
  heroStats: [
    { iconName: "GraduationCap", label: "Educator", value: "5+ Years", subValue: "Teaching Experience" },
    { iconName: "Users", label: "Students Impacted", value: "1,200+", subValue: "And Growing" },
    { iconName: "Youtube", label: "Platforms", value: "YouTube", subValue: "& Online Programs" },
    { iconName: "MapPin", label: "Location", value: "Bangladesh", subValue: "Serving Globally" },
  ],
  socialLinks: [
    { platform: "Facebook", url: "#", iconName: "Facebook" },
    { platform: "Instagram", url: "#", iconName: "Instagram" },
    { platform: "YouTube", url: "#", iconName: "Youtube" },
    { platform: "LinkedIn", url: "#", iconName: "Linkedin" },
    { platform: "Twitter", url: "#", iconName: "Twitter" },
  ]
};

export const metricsData: MetricItem[] = [
  { id: "m1", label: "Education", value: "BSc & MSc in EEE", iconName: "GraduationCap" },
  { id: "m2", label: "Experience", value: "5+ Years", iconName: "UserCheck" },
  { id: "m3", label: "Research", value: "Publications", iconName: "BookOpen" },
  { id: "m4", label: "Projects", value: "10+ Completed", iconName: "Award" },
];

export const educationData: EducationItem[] = [
  { id: "e1", degree: "SSC", institution: "CUET School & College", year: "2016", gpa: "GPA: 5.00", displayOrder: 1 },
  { id: "e2", degree: "HSC", institution: "Govt. City College, Chattogram", year: "2018", gpa: "GPA: 5.00", displayOrder: 2 },
  { id: "e3", degree: "BSc in EEE", institution: "CUET", year: "2020", gpa: "CGPA: 3.61 / 4.00", displayOrder: 3 },
  { id: "e4", degree: "MSc in EEE", institution: "CUET (Pursuing)", year: "Present", gpa: "—", displayOrder: 4 },
];

export const researchThesisData: ResearchThesis = {
  type: "Undergraduate Thesis",
  supervisor: "Tamanna Faman",
  coSupervisors: ["Prof. Ishtiaque Reza", "Sagar Mutsuddi"],
  title: "Mid Infrared Three Octave Supercontinuum Generation in Dispersion Engineered As₂Se₃ Chalcogenide Waveguides : A Comparative Study of Ridge, Rib and Double Rib Geometries",
  keyFindings: [
    "Efficient broadband MIR generation at low peak power and compact device compared six waveguide geometries.",
    "Comparative Study of Ridge, Rib and Double Rib Geometries",
  ],
};

export const publicationsData: PublicationItem[] = [
  {
    id: "p1",
    type: "Conference",
    title: "Low-Power Ultra-Broadband Supercontinuum Generation in a Compact AlGaAs Rib Waveguide with Three Zero-Dispersion Wavelengths",
    venue: "IEEE International Conference",
    year: "2023",
  },
  {
    id: "p2",
    type: "Journal",
    title: "Mid Infrared Three Octave Supercontinuum Generation in Dispersion Engineered As₂Se₃ Chalcogenide Waveguides",
    venue: "Optical Engineering Research",
    year: "2024",
  },
];

export const skillCategoriesData: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: ["C", "Python"],
  },
  {
    title: "Libraries & Frameworks",
    skills: ["NumPy", "Pandas", "Matplotlib"],
  },
  {
    title: "Engineering Software",
    skills: ["COMSOL", "MATLAB", "Cadence", "ADS", "PVsyst", "MikroC Pro", "Proteus"],
  },
  {
    title: "Documentation & Productivity",
    skills: ["LaTeX", "MS Word", "MS PowerPoint"],
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: "proj1",
    title: "Solar PV System",
    shortDescription: "1.88 kWp standalone solar PV system with battery storage for Pre-Engineering Building, CUET.",
    fullDescription: "Simulated annual PV performance achieving 2370.9 kWh/year useful solar energy with a performance ratio of 74.56%. Analyzed load demand, battery storage, system losses, and solar fraction.",
    category: "Renewable Energy",
    iconName: "Sun",
    technologies: ["PVsyst", "Solar GIS", "AutoCAD"],
    displayOrder: 1,
  },
  {
    id: "proj2",
    title: "EV Charging Station",
    shortDescription: "AC Level-2 EV charging station design using AutoCAD for residential colony.",
    fullDescription: "Designed complete electrical service layout for 18-port AC Level-2 EV charging station including fittings, conduit routing, cabling, earthing, protection, and BOQ estimation.",
    category: "Electrical Design",
    iconName: "Zap",
    technologies: ["AutoCAD", "Power Distribution", "BOQ"],
    displayOrder: 2,
  },
  {
    id: "proj3",
    title: "Door Lock System",
    shortDescription: "Arduino based password protected automatic door lock system.",
    fullDescription: "Developed password-protected smart door-lock prototype using Arduino Uno, 4x3 keypad, 16x2 LCD, servo motor, and 9V battery supply. Programmed 4-digit authentication logic.",
    category: "Embedded Systems",
    iconName: "Lock",
    technologies: ["Arduino", "C++", "Sensors"],
    displayOrder: 3,
  },
  {
    id: "proj4",
    title: "Temperature Fan",
    shortDescription: "Arduino based temperature controlled DC fan system with PWM speed control.",
    fullDescription: "Designed automatic cooling system using Arduino Uno, DHT11 temperature sensor, L298N motor driver, DC motor, and fan with PWM duty range speed control.",
    category: "Automation",
    iconName: "Fan",
    technologies: ["Arduino", "DHT11", "PWM Control"],
    displayOrder: 4,
  },
  {
    id: "proj5",
    title: "Soccer Bot",
    shortDescription: "Arduino based remote-controlled soccer bot (Participated in CU Science Fair 2023).",
    fullDescription: "Designed and engineered remote-controlled wireless soccer robot with high torque motor drives and custom chassis for CU Science Fair 2023 competition.",
    category: "Robotics",
    iconName: "Bot",
    technologies: ["Robotics", "RF Modules", "Motor Drivers"],
    displayOrder: 5,
  },
  {
    id: "proj6",
    title: "4x1 Multiplexer MUX",
    shortDescription: "Cadence-based CMOS layout and post-layout verification of a 4x1 Multiplexer.",
    fullDescription: "Implemented design in 240 nm CMOS technology including NAND, 2x1 MUX, and final 4x1 MUX layouts. Verified physical design through DRC, LVS, and RCX in Cadence Virtuoso.",
    category: "VLSI & Microelectronics",
    iconName: "Cpu",
    technologies: ["Cadence Virtuoso", "CMOS Layout", "DRC/LVS"],
    displayOrder: 6,
  },
];

export const trainingData: TrainingItem = {
  id: "t1",
  title: "10 Days Industrial Training",
  organization: "Bangladesh Telecommunication Company Limited (BTCL)",
  duration: "10 Days",
  description: "Comprehensive hands-on training on optical fiber communication networks, PSTN switching systems, telecom power infrastructure, and transmission technologies.",
  certificateUrl: "#",
};
