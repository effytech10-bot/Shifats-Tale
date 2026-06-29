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

export interface ResearchExperienceItem {
  id: string;
  title: string;
  type: string;
  year: string;
  supervisor?: string;
  coSupervisors?: string;
  summary: string;
  focusArea: string;
  techniques: string;
  outcome: string;
  iconName: string;
}

export interface PublicationItem {
  id: string;
  type: "Journal Article" | "Conference Paper";
  title: string;
  venue: string;
  year: string;
  summary: string;
  status?: string;
  location?: string;
  link?: string;
  doiLink?: string;
  certificateLink?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  iconName: string;
  imageUrl: string;
  isFeatured?: boolean;
  technologies?: string[];
  metrics?: { label: string; value: string; iconName: string }[];
  actionLinks?: { label: string; url: string; iconName: string; variant?: "primary" | "outline" }[];
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
  organizationType: string;
  duration: string;
  status: string;
  description: string;
  features: { label: string; iconName: string }[];
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

export interface ResearchThesis {
  type: string;
  supervisor: string;
  coSupervisors: string[];
  title: string;
  keyFindings: string[];
}

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

export const researchExperienceData: ResearchExperienceItem[] = [
  {
    id: "r1",
    title: "Mid Infrared Three Octave Supercontinuum Generation in Dispersion Engineered As₂Se₃ Chalcogenide Waveguides",
    type: "Undergraduate Thesis",
    year: "2023 - Present",
    supervisor: "Tanha Zaman",
    coSupervisors: "Prof. Istiaque Reja, Sagar Mutsuddi",
    summary: "Efficient broadband MIR generation at low peak power and compact device compared six waveguide geometries.\nComparative study of Ridge, Rib and Double Rib Geometries.",
    focusArea: "Supercontinuum Generation",
    techniques: "MIR, Waveguides, Dispersion Engineering",
    outcome: "Low Peak Power Broadband Output",
    iconName: "FileText"
  },
  {
    id: "r2",
    title: "Placeholder Academic Project Title Here",
    type: "Academic Project",
    year: "2022 - 2023",
    supervisor: "Dr. Example Name",
    coSupervisors: "Example Co-supervisor",
    summary: "Placeholder summary for the academic project. This text will be replaced by the actual project details.",
    focusArea: "Project Focus Area",
    techniques: "Tools and Techniques",
    outcome: "Project Outcome",
    iconName: "GraduationCap"
  },
  {
    id: "r3",
    title: "Placeholder Collaborative Research Title",
    type: "Collaborative Research",
    year: "2022",
    supervisor: "Dr. Another Name",
    summary: "Placeholder summary for the collaborative research. This text will be replaced by the actual details.",
    focusArea: "Research Focus",
    techniques: "Collaborative Tools",
    outcome: "Research Findings",
    iconName: "Users"
  },
  {
    id: "r4",
    title: "Placeholder Lab Investigation Title",
    type: "Lab Investigation",
    year: "2021",
    supervisor: "Lab Instructor",
    summary: "Placeholder summary for the lab investigation. This text will be replaced by the actual details.",
    focusArea: "Lab Focus",
    techniques: "Lab Equipment",
    outcome: "Investigation Results",
    iconName: "FlaskConical"
  },
  {
    id: "r5",
    title: "Dummy Research Project 1",
    type: "Academic Project",
    year: "2020",
    supervisor: "Dummy Sup 1",
    summary: "Dummy summary 1",
    focusArea: "Dummy Area 1",
    techniques: "Dummy Tech 1",
    outcome: "Dummy Outcome 1",
    iconName: "Book"
  },
  {
    id: "r6",
    title: "Dummy Research Project 2",
    type: "Collaborative Research",
    year: "2019",
    supervisor: "Dummy Sup 2",
    summary: "Dummy summary 2",
    focusArea: "Dummy Area 2",
    techniques: "Dummy Tech 2",
    outcome: "Dummy Outcome 2",
    iconName: "FileText"
  },
  {
    id: "r7",
    title: "Dummy Research Project 3",
    type: "Lab Investigation",
    year: "2018",
    supervisor: "Dummy Sup 3",
    summary: "Dummy summary 3",
    focusArea: "Dummy Area 3",
    techniques: "Dummy Tech 3",
    outcome: "Dummy Outcome 3",
    iconName: "Users"
  },
  {
    id: "r8",
    title: "Dummy Research Project 4",
    type: "Academic Project",
    year: "2017",
    supervisor: "Dummy Sup 4",
    summary: "Dummy summary 4",
    focusArea: "Dummy Area 4",
    techniques: "Dummy Tech 4",
    outcome: "Dummy Outcome 4",
    iconName: "GraduationCap"
  },
  {
    id: "r9",
    title: "Dummy Research Project 5",
    type: "Undergraduate Thesis",
    year: "2016",
    supervisor: "Dummy Sup 5",
    summary: "Dummy summary 5",
    focusArea: "Dummy Area 5",
    techniques: "Dummy Tech 5",
    outcome: "Dummy Outcome 5",
    iconName: "FlaskConical"
  }
];

export const publicationsData: PublicationItem[] = [
  {
    id: "p1",
    type: "Journal Article",
    title: "Mid-Infrared Three Octave Supercontinuum Generation in Dispersion Engineered As₂Se₃ Chalcogenide Waveguides: A Comparative Study of Ridge, Rib and Double Rib Geometries",
    venue: "Optics & Laser Technology",
    year: "2025",
    summary: "Comparative analysis of dispersion engineered ridge, rib and double-rib waveguides for broadband mid-IR supercontinuum generation.",
    status: "Under Review",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p2",
    type: "Conference Paper",
    title: "Low-Power Ultra-Broadband Supercontinuum Generation in a Compact AlGaAs Rib Waveguide with Three Zero-Dispersion Wavelengths",
    venue: "CLEO: Science & Innovations",
    year: "2024",
    summary: "Demonstration of ultra-broadband SCG in a compact AlGaAs rib waveguide featuring three zero-dispersion wavelengths for low-power operation.",
    location: "San Jose, USA",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p3",
    type: "Conference Paper",
    title: "Design and Optimization of Rib Waveguide Geometries for Enhanced Supercontinuum Generation in Mid-Infrared",
    venue: "Photonics North",
    year: "2023",
    summary: "Optimization of rib waveguide dimensions and dispersion profiles to enhance supercontinuum bandwidth and flatness.",
    location: "Vancouver, Canada",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p4",
    type: "Journal Article",
    title: "Nonlinear Propagation and Noise Characterization in Chalcogenide Waveguides for Mid-IR Supercontinuum Sources",
    venue: "Journal of Lightwave Technology",
    year: "2022",
    summary: "Investigation of nonlinear effects and noise performance in chalcogenide waveguides for robust mid-IR broadband source development.",
    status: "Published",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p5",
    type: "Journal Article",
    title: "Dummy Publication 1 - Advanced Photonics",
    venue: "Journal of Optics",
    year: "2021",
    summary: "Dummy summary for publication 1. Exploring new boundaries in photonics.",
    status: "Published",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p6",
    type: "Conference Paper",
    title: "Dummy Publication 2 - Optical Networks",
    venue: "OFC Conference",
    year: "2020",
    summary: "Dummy summary for publication 2. Enhancing optical network capacities.",
    location: "San Diego, USA",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p7",
    type: "Journal Article",
    title: "Dummy Publication 3 - Fiber Optics",
    venue: "Optics Express",
    year: "2019",
    summary: "Dummy summary for publication 3. Innovations in fiber optic technology.",
    status: "Published",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p8",
    type: "Conference Paper",
    title: "Dummy Publication 4 - Silicon Photonics",
    venue: "ECOC",
    year: "2018",
    summary: "Dummy summary for publication 4. Developments in silicon photonics.",
    location: "Rome, Italy",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  },
  {
    id: "p9",
    type: "Journal Article",
    title: "Dummy Publication 5 - Laser Systems",
    venue: "Applied Optics",
    year: "2017",
    summary: "Dummy summary for publication 5. Next generation laser systems.",
    status: "Published",
    link: "#",
    doiLink: "#",
    certificateLink: "#",
  }
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
    title: "Design & Performance Analysis of a 1.88 kWp Standalone Solar PV System with Battery Storage",
    shortDescription: "Designed and simulated a standalone solar PV system for the Pre-Engineering Building, CUET with battery storage to ensure reliable and sustainable power.",
    category: "Energy",
    iconName: "Sun",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-1f9509e92eb7?q=80&w=2069&auto=format&fit=crop",
    isFeatured: true,
    metrics: [
      { label: "Useful Solar Energy", value: "2370.9 kWh/year", iconName: "Sun" },
      { label: "Performance Ratio", value: "74.56%", iconName: "Percent" },
      { label: "Renewable Contribution", value: "84.40%", iconName: "Leaf" }
    ],
    actionLinks: [
      { label: "View Details", url: "/projects/proj1", iconName: "ArrowRight", variant: "primary" },
      { label: "Project Report", url: "#", iconName: "FileText", variant: "outline" },
      { label: "System Report", url: "#", iconName: "BarChart", variant: "outline" }
    ],
    displayOrder: 1,
  },
  {
    id: "proj2",
    title: "Design & Load Assessment of an AC Level-2 EV Charging Station",
    shortDescription: "Designed an 18-port AC Level-2 EV charging station for a residential colony using AutoCAD.",
    category: "Power",
    iconName: "Zap",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop",
    technologies: ["AutoCAD", "Load Study", "LV Design", "Protection"],
    metrics: [
      { label: "Charging Points", value: "18 Ports", iconName: "BatteryCharging" },
      { label: "Transformer Size", value: "100 kVA", iconName: "Zap" },
      { label: "System Voltage", value: "11 kV / 415 V", iconName: "Sun" }
    ],
    actionLinks: [
      { label: "View Details", url: "/projects/proj2", iconName: "ArrowRight", variant: "primary" }
    ],
    displayOrder: 2,
  },
  {
    id: "proj3",
    title: "Door Lock System",
    shortDescription: "Arduino based password protected automatic door lock system.",
    category: "Embedded",
    iconName: "Cpu",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Arduino", "Keypad", "Relay", "LCD"],
    actionLinks: [
      { label: "View Details", url: "/projects/proj3", iconName: "ArrowRight", variant: "primary" },
      { label: "Code", url: "#", iconName: "Code", variant: "outline" }
    ],
    displayOrder: 3,
  },
  {
    id: "proj4",
    title: "Temperature Controlled Fan",
    shortDescription: "Arduino based temperature controlled DC fan system with PWM speed control.",
    category: "Electronics",
    iconName: "Settings",
    imageUrl: "https://images.unsplash.com/photo-1618338965682-1a48c6600c3f?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Arduino", "PWM", "LM35", "MOSFET"],
    actionLinks: [
      { label: "View Details", url: "/projects/proj4", iconName: "ArrowRight", variant: "primary" },
      { label: "Schematic", url: "#", iconName: "FileSymlink", variant: "outline" }
    ],
    displayOrder: 4,
  },
  {
    id: "proj5",
    title: "Soccer Bot",
    shortDescription: "Arduino based remote-controlled soccer bot participated in CUET Science Carnival.",
    category: "Automation",
    iconName: "Bot",
    imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Arduino", "DC Motor", "L298N", "Sensors"],
    actionLinks: [
      { label: "View Details", url: "/projects/proj5", iconName: "ArrowRight", variant: "primary" },
      { label: "Report", url: "#", iconName: "FileText", variant: "outline" }
    ],
    displayOrder: 5,
  },
  {
    id: "proj6",
    title: "4x1 Multiplexer MUX",
    shortDescription: "Cadence-based CMOS layout and post-layout verification of a 4x1 Multiplexer.",
    category: "CAD",
    iconName: "Cpu",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Cadence", "CMOS", "Layout", "DRC"],
    actionLinks: [
      { label: "View Details", url: "/projects/proj6", iconName: "ArrowRight", variant: "primary" },
      { label: "Layout", url: "#", iconName: "Layout", variant: "outline" }
    ],
    displayOrder: 6,
  },
  {
    id: "proj7",
    title: "Smart Irrigation Controller",
    shortDescription: "Automated irrigation system using soil moisture sensing and relay control.",
    category: "Automation",
    iconName: "Droplet",
    imageUrl: "https://images.unsplash.com/photo-1595856425414-27d7f722ffeb?q=80&w=2070&auto=format&fit=crop",
    technologies: ["Arduino", "Soil Sensor", "Relay", "LCD"],
    actionLinks: [
      { label: "View Details", url: "/projects/proj7", iconName: "ArrowRight", variant: "primary" },
      { label: "Code", url: "#", iconName: "Code", variant: "outline" }
    ],
    displayOrder: 7,
  }
];

export const trainingData: TrainingItem = {
  id: "t1",
  title: "10 Days Industrial Training",
  organization: "Bangladesh Telecommunication Company Limited (BTCL)",
  organizationType: "Government",
  duration: "10 Days",
  status: "Completed",
  description: "Comprehensive hands-on training on optical fiber communication networks, PSTN switching systems, telecom power infrastructure, and transmission technologies.",
  features: [
    { label: "Optical Fiber Communication Networks", iconName: "Cable" },
    { label: "PTN Switching Systems", iconName: "PhoneCall" },
    { label: "Power Infrastructure", iconName: "Zap" },
    { label: "Transmission Technologies", iconName: "Radio" },
  ],
  certificateUrl: "#",
};
