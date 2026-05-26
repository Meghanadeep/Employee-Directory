"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOverride, saveOverride, EmployeeOverride } from "@/lib/idb-profile-overrides";

type Employee = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  manager: string;
  joined: string;
  birthday: string;
  pronouns: string;
  education: string;
  bio: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  interests: string[];
  projects: string[];
  initials: string;
  gradient: string;
  status: "active" | "away" | "busy";
};

const employees: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Software Engineer",
    department: "Engineering",
    email: "alice@company.com",
    phone: "+1 555-0101",
    location: "San Francisco, CA",
    timezone: "PST (UTC−8)",
    manager: "Frank Chen",
    joined: "March 12, 2022",
    birthday: "July 14",
    pronouns: "she/her",
    education: "B.S. Computer Science, UC Berkeley",
    bio: "Full-stack engineer with a love for clean APIs and great developer experience. Open-source contributor and occasional conference speaker.",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    certifications: [],
    languages: ["English", "Mandarin"],
    interests: ["Open Source", "Rock Climbing", "Science Fiction", "Sourdough Baking"],
    projects: ["API Gateway Redesign", "Dev Portal v2", "Internal CLI Tooling"],
    initials: "AJ",
    gradient: "from-violet-200 to-indigo-300",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Product Manager",
    department: "Product",
    email: "bob@company.com",
    phone: "+1 555-0102",
    location: "New York, NY",
    timezone: "EST (UTC−5)",
    manager: "Eva Martinez",
    joined: "July 5, 2021",
    birthday: "February 3",
    pronouns: "he/him",
    education: "MBA, Wharton School",
    bio: "Customer-obsessed PM who bridges engineering and business. Passionate about data-driven decisions and lean product discovery.",
    skills: ["Roadmapping", "User Research", "SQL", "Figma"],
    certifications: ["Certified Scrum Product Owner (CSPO)"],
    languages: ["English"],
    interests: ["Running", "Board Games", "Economics Podcasts", "Travel"],
    projects: ["Q3 Roadmap Planning", "Feature Discovery Sprint", "Pricing Model Research"],
    initials: "BS",
    gradient: "from-sky-200 to-cyan-300",
    status: "away",
  },
  {
    id: 3,
    name: "Carol White",
    role: "UX Designer",
    department: "Design",
    email: "carol@company.com",
    phone: "+1 555-0103",
    location: "Austin, TX",
    timezone: "CST (UTC−6)",
    manager: "Grace Kim",
    joined: "January 18, 2023",
    birthday: "September 22",
    pronouns: "she/her",
    education: "M.A. Human-Computer Interaction, Georgia Tech",
    bio: "Systems thinker and interaction designer crafting experiences people love. Background in cognitive psychology.",
    skills: ["Figma", "Prototyping", "Design Systems", "User Testing"],
    certifications: ["Nielsen Norman UX Certification"],
    languages: ["English", "French"],
    interests: ["Pottery", "Psychology Books", "Hiking", "Cooking"],
    projects: ["Onboarding Redesign", "Design System v3", "Mobile Navigation Audit"],
    initials: "CW",
    gradient: "from-pink-200 to-rose-300",
    status: "active",
  },
  {
    id: 4,
    name: "David Lee",
    role: "Data Analyst",
    department: "Analytics",
    email: "david@company.com",
    phone: "+1 555-0104",
    location: "Seattle, WA",
    timezone: "PST (UTC−8)",
    manager: "Bob Smith",
    joined: "September 3, 2022",
    birthday: "December 5",
    pronouns: "he/him",
    education: "B.S. Statistics, University of Washington",
    bio: "Turns raw data into actionable insights. Loves building dashboards and finding the story hidden in numbers.",
    skills: ["Python", "SQL", "Tableau", "dbt"],
    certifications: ["Google Data Analytics Certificate", "dbt Certified Developer"],
    languages: ["English", "Korean"],
    interests: ["Basketball", "Data Visualisation Art", "K-Pop", "Chess"],
    projects: ["Revenue Dashboard", "Churn Prediction Model", "Data Warehouse Migration"],
    initials: "DL",
    gradient: "from-emerald-200 to-teal-300",
    status: "busy",
  },
  {
    id: 5,
    name: "Eva Martinez",
    role: "HR Manager",
    department: "Human Resources",
    email: "eva@company.com",
    phone: "+1 555-0105",
    location: "Chicago, IL",
    timezone: "CST (UTC−6)",
    manager: "Henry Brown",
    joined: "February 28, 2020",
    birthday: "April 11",
    pronouns: "she/her",
    education: "B.A. Psychology, Northwestern University",
    bio: "People-first leader building the culture and processes that help teams thrive. Champion of diversity and belonging.",
    skills: ["Talent Acquisition", "L&D", "HRIS", "Performance Reviews"],
    certifications: ["SHRM-CP", "CIPD Level 5"],
    languages: ["English", "Spanish"],
    interests: ["Yoga", "Mentoring", "True Crime Podcasts", "Gardening"],
    projects: ["Performance Review Cycle", "Culture Survey 2026", "New Hire Onboarding Revamp"],
    initials: "EM",
    gradient: "from-amber-200 to-orange-300",
    status: "active",
  },
  {
    id: 6,
    name: "Frank Chen",
    role: "DevOps Engineer",
    department: "Engineering",
    email: "frank@company.com",
    phone: "+1 555-0106",
    location: "San Francisco, CA",
    timezone: "PST (UTC−8)",
    manager: "Alice Johnson",
    joined: "June 14, 2021",
    birthday: "October 29",
    pronouns: "he/him",
    education: "B.S. Computer Engineering, Stanford University",
    bio: "Keeps the lights on and the deploys fast. Kubernetes aficionado and automation zealot.",
    skills: ["Kubernetes", "Terraform", "AWS", "Go"],
    certifications: ["CKA (Certified Kubernetes Administrator)", "AWS Solutions Architect"],
    languages: ["English", "Mandarin"],
    interests: ["Home Lab", "Cycling", "Philosophy", "Video Games"],
    projects: ["Kubernetes Upgrade", "CI/CD Pipeline Overhaul", "Disaster Recovery Playbook"],
    initials: "FC",
    gradient: "from-slate-200 to-gray-300",
    status: "active",
  },
  {
    id: 7,
    name: "Grace Kim",
    role: "Marketing Lead",
    department: "Marketing",
    email: "grace@company.com",
    phone: "+1 555-0107",
    location: "Los Angeles, CA",
    timezone: "PST (UTC−8)",
    manager: "Henry Brown",
    joined: "November 1, 2021",
    birthday: "June 17",
    pronouns: "she/her",
    education: "B.A. Marketing, UCLA",
    bio: "Brand storyteller and growth marketer. Passionate about content, community, and campaigns that actually convert.",
    skills: ["Brand Strategy", "SEO", "Copywriting", "HubSpot"],
    certifications: ["Google Analytics Certified", "HubSpot Marketing Certified"],
    languages: ["English", "Korean"],
    interests: ["Photography", "Travel", "K-Drama", "Fitness"],
    projects: ["Brand Refresh Campaign", "Q2 Content Calendar", "Influencer Partnership Programme"],
    initials: "GK",
    gradient: "from-fuchsia-200 to-purple-300",
    status: "away",
  },
  {
    id: 8,
    name: "Henry Brown",
    role: "Sales Executive",
    department: "Sales",
    email: "henry@company.com",
    phone: "+1 555-0108",
    location: "Boston, MA",
    timezone: "EST (UTC−5)",
    manager: "Eva Martinez",
    joined: "April 22, 2019",
    birthday: "January 8",
    pronouns: "he/him",
    education: "B.S. Business Administration, Boston College",
    bio: "Relationship builder and enterprise deal closer. Consistently above quota and a mentor to junior reps.",
    skills: ["Enterprise Sales", "Salesforce", "Negotiation", "Account Management"],
    certifications: ["Salesforce Certified Sales Cloud Consultant"],
    languages: ["English"],
    interests: ["Golf", "Entrepreneurship", "History", "Wine Tasting"],
    projects: ["Enterprise Q2 Pipeline", "Sales Playbook Update", "New Market Expansion"],
    initials: "HB",
    gradient: "from-red-200 to-rose-300",
    status: "active",
  },
  {
    id: 9,
    name: "Iris Patel",
    role: "Backend Engineer",
    department: "Engineering",
    email: "iris@company.com",
    phone: "+1 555-0109",
    location: "Bangalore, India",
    timezone: "IST (UTC+5:30)",
    manager: "Frank Chen",
    joined: "August 8, 2023",
    birthday: "March 30",
    pronouns: "she/her",
    education: "B.Tech Computer Science, IIT Bombay",
    bio: "Microservices architect who cares deeply about reliability, observability, and elegant system design.",
    skills: ["Java", "Kafka", "gRPC", "Redis"],
    certifications: ["AWS Developer Associate", "Confluent Certified Apache Kafka Developer"],
    languages: ["English", "Hindi", "Kannada"],
    interests: ["Badminton", "Classical Music", "Cooking", "Open Source"],
    projects: ["Payment Service Rewrite", "Observability Platform", "gRPC Migration"],
    initials: "IP",
    gradient: "from-lime-200 to-green-300",
    status: "active",
  },
  {
    id: 10,
    name: "Jake Thompson",
    role: "Security Engineer",
    department: "Engineering",
    email: "jake@company.com",
    phone: "+1 555-0110",
    location: "Washington, DC",
    timezone: "EST (UTC−5)",
    manager: "Frank Chen",
    joined: "May 5, 2022",
    birthday: "August 19",
    pronouns: "he/him",
    education: "B.S. Computer Security, Carnegie Mellon University",
    bio: "Keeps the company's data and systems safe. Bug bounty hunter and CTF competitor on weekends.",
    skills: ["Penetration Testing", "SIEM", "Python", "Cloud Security"],
    certifications: ["OSCP", "CEH", "AWS Security Specialty"],
    languages: ["English"],
    interests: ["CTF Competitions", "Lock Picking", "Hiking", "Science Fiction"],
    projects: ["Zero-Trust Architecture", "Pen Test Schedule Q2", "SOC 2 Type II Renewal"],
    initials: "JT",
    gradient: "from-blue-200 to-indigo-300",
    status: "busy",
  },
  {
    id: 11,
    name: "Karen Liu",
    role: "Finance Analyst",
    department: "Finance",
    email: "karen@company.com",
    phone: "+1 555-0111",
    location: "Toronto, Canada",
    timezone: "EST (UTC−5)",
    manager: "Henry Brown",
    joined: "December 10, 2022",
    birthday: "May 7",
    pronouns: "she/her",
    education: "B.Com Finance, University of Toronto",
    bio: "Numbers whiz who models scenarios and keeps the business on track. CFA charterholder.",
    skills: ["Financial Modeling", "Excel", "Power BI", "FP&A"],
    certifications: ["CFA Charterholder", "CPA"],
    languages: ["English", "Mandarin"],
    interests: ["Tennis", "Personal Finance", "Travel", "Meditation"],
    projects: ["Q2 Budget Forecast", "ERP Migration", "Variance Analysis Dashboard"],
    initials: "KL",
    gradient: "from-yellow-200 to-amber-300",
    status: "active",
  },
  {
    id: 12,
    name: "Leo Nguyen",
    role: "Mobile Engineer",
    department: "Engineering",
    email: "leo@company.com",
    phone: "+1 555-0112",
    location: "Ho Chi Minh City, Vietnam",
    timezone: "ICT (UTC+7)",
    manager: "Alice Johnson",
    joined: "October 15, 2023",
    birthday: "November 2",
    pronouns: "he/him",
    education: "B.Eng Software Engineering, HCMC University of Technology",
    bio: "Crafts delightful mobile experiences on iOS and Android. Performance obsessive and Swift enthusiast.",
    skills: ["Swift", "Kotlin", "React Native", "Xcode"],
    certifications: ["Apple Certified Developer"],
    languages: ["English", "Vietnamese"],
    interests: ["Photography", "Gaming", "Street Food", "Surfing"],
    projects: ["iOS App Redesign", "Push Notification System", "Offline Mode Feature"],
    initials: "LN",
    gradient: "from-cyan-200 to-blue-300",
    status: "active",
  },
  {
    id: 13,
    name: "Maya Patel",
    role: "Data Scientist",
    department: "Analytics",
    email: "maya@company.com",
    phone: "+1 555-0113",
    location: "Austin, TX",
    timezone: "CST (UTC−6)",
    manager: "David Lee",
    joined: "March 7, 2023",
    birthday: "February 25",
    pronouns: "she/her",
    education: "Ph.D. Machine Learning, MIT",
    bio: "Applies machine learning to solve real business problems. Passionate about NLP, recommendation systems, and making models explainable.",
    skills: ["Python", "PyTorch", "Spark", "MLflow"],
    certifications: ["AWS Machine Learning Specialty", "TensorFlow Developer Certificate"],
    languages: ["English", "Hindi"],
    interests: ["Bouldering", "Research Papers", "Cooking", "Tabla Drums"],
    projects: ["Recommendation Engine v2", "NLP Pipeline", "Model Explainability Framework"],
    initials: "MP",
    gradient: "from-rose-200 to-pink-300",
    status: "active",
  },
  {
    id: 14,
    name: "Omar Hassan",
    role: "Customer Success Manager",
    department: "Sales",
    email: "omar@company.com",
    phone: "+1 555-0114",
    location: "Dubai, UAE",
    timezone: "GST (UTC+4)",
    manager: "Henry Brown",
    joined: "June 20, 2022",
    birthday: "July 31",
    pronouns: "he/him",
    education: "MBA, INSEAD",
    bio: "Builds lasting relationships with enterprise clients. Focused on onboarding, retention, and turning customers into advocates.",
    skills: ["CRM", "Onboarding", "Salesforce", "Communication"],
    certifications: ["Salesforce Certified Administrator", "Gainsight Certified Admin"],
    languages: ["English", "Arabic"],
    interests: ["Cricket", "Travel", "Arabic Calligraphy", "Entrepreneurship"],
    projects: ["Enterprise Onboarding Playbook", "Renewal Risk Dashboard", "QBR Template Library"],
    initials: "OH",
    gradient: "from-teal-200 to-emerald-300",
    status: "active",
  },
  {
    id: 15,
    name: "Priya Sharma",
    role: "Legal Counsel",
    department: "Legal",
    email: "priya@company.com",
    phone: "+1 555-0115",
    location: "London, UK",
    timezone: "GMT (UTC+0)",
    manager: "Eva Martinez",
    joined: "November 14, 2021",
    birthday: "October 4",
    pronouns: "she/her",
    education: "LLB, University of Oxford",
    bio: "Advises on contracts, privacy law, and regulatory compliance. Keeps the company protected while enabling teams to move fast.",
    skills: ["Contract Law", "GDPR", "IP", "M&A"],
    certifications: ["Qualified Solicitor (England & Wales)", "CIPP/E"],
    languages: ["English", "Hindi"],
    interests: ["Theatre", "Long-Distance Running", "Travel", "Book Clubs"],
    projects: ["Data Privacy Audit", "Vendor Contract Review", "IP Registration"],
    initials: "PS",
    gradient: "from-indigo-200 to-violet-300",
    status: "busy",
  },
  {
    id: 16,
    name: "Ryan Okafor",
    role: "Frontend Engineer",
    department: "Engineering",
    email: "ryan@company.com",
    phone: "+1 555-0116",
    location: "Lagos, Nigeria",
    timezone: "WAT (UTC+1)",
    manager: "Alice Johnson",
    joined: "February 1, 2024",
    birthday: "December 14",
    pronouns: "he/him",
    education: "B.Sc Computer Science, University of Lagos",
    bio: "Crafts pixel-perfect UIs with an obsession for performance and accessibility. Champion of design systems and component architecture.",
    skills: ["React", "CSS", "Figma", "Storybook"],
    certifications: [],
    languages: ["English", "Yoruba"],
    interests: ["Afrobeats", "Photography", "Open Source", "Football"],
    projects: ["Component Library v4", "Web Performance Audit", "Accessibility Overhaul"],
    initials: "RO",
    gradient: "from-orange-200 to-red-300",
    status: "active",
  },
  {
    id: 17,
    name: "Sofia Rossi",
    role: "Brand Designer",
    department: "Design",
    email: "sofia@company.com",
    phone: "+1 555-0117",
    location: "Milan, Italy",
    timezone: "CET (UTC+1)",
    manager: "Carol White",
    joined: "August 30, 2022",
    birthday: "March 18",
    pronouns: "she/her",
    education: "M.F.A. Visual Arts, Accademia di Brera",
    bio: "Shapes visual identity with a fine art background. Brings warmth and consistency to every brand touchpoint, from campaigns to packaging.",
    skills: ["Illustrator", "Brand Identity", "Motion", "Typography"],
    certifications: [],
    languages: ["English", "Italian"],
    interests: ["Ceramics", "Film Photography", "Travel", "Architecture"],
    projects: ["2026 Brand Guidelines", "Campaign Visual Identity", "Merchandise Design"],
    initials: "SR",
    gradient: "from-fuchsia-200 to-pink-300",
    status: "away",
  },
  {
    id: 18,
    name: "Tom Nakamura",
    role: "QA Engineer",
    department: "Engineering",
    email: "tom@company.com",
    phone: "+1 555-0118",
    location: "Tokyo, Japan",
    timezone: "JST (UTC+9)",
    manager: "Frank Chen",
    joined: "April 11, 2023",
    birthday: "June 6",
    pronouns: "he/him",
    education: "B.Eng Information Engineering, University of Tokyo",
    bio: "Ensures nothing ships broken. Builds robust test automation frameworks and advocates for quality throughout the development lifecycle.",
    skills: ["Playwright", "Jest", "CI/CD", "Test Strategy"],
    certifications: ["ISTQB Advanced Level", "Playwright Certified Engineer"],
    languages: ["English", "Japanese"],
    interests: ["Origami", "Gaming", "Hiking", "Bonsai"],
    projects: ["E2E Test Suite Expansion", "Load Testing Framework", "Bug Triage Process"],
    initials: "TN",
    gradient: "from-sky-200 to-blue-300",
    status: "active",
  },
  {
    id: 19,
    name: "Amara Diallo",
    role: "Operations Manager",
    department: "Operations",
    email: "amara@company.com",
    phone: "+1 555-0119",
    location: "Paris, France",
    timezone: "CET (UTC+1)",
    manager: "Eva Martinez",
    joined: "January 9, 2021",
    birthday: "August 27",
    pronouns: "she/her",
    education: "M.Sc Management, HEC Paris",
    bio: "Keeps the business running smoothly by optimising processes and eliminating bottlenecks. Runs on spreadsheets and strong coffee.",
    skills: ["Process Design", "Notion", "Vendor Management", "OKRs"],
    certifications: ["PMP", "Lean Six Sigma Green Belt"],
    languages: ["English", "French", "Wolof"],
    interests: ["Ballet", "Philosophy", "Cooking", "Afrobeats"],
    projects: ["Vendor Consolidation", "Process Documentation Hub", "OKR Tracking System"],
    initials: "AD",
    gradient: "from-lime-200 to-green-300",
    status: "active",
  },
  {
    id: 20,
    name: "Lena Müller",
    role: "Content Strategist",
    department: "Marketing",
    email: "lena@company.com",
    phone: "+1 555-0120",
    location: "Berlin, Germany",
    timezone: "CET (UTC+1)",
    manager: "Grace Kim",
    joined: "September 18, 2022",
    birthday: "April 3",
    pronouns: "she/her",
    education: "B.A. Communications, Freie Universität Berlin",
    bio: "Turns complex ideas into compelling narratives. Owns the editorial calendar and leads content across blog, social, and email.",
    skills: ["Copywriting", "SEO", "Content Calendar", "Analytics"],
    certifications: ["HubSpot Content Marketing Certified"],
    languages: ["English", "German"],
    interests: ["Creative Writing", "Cycling", "Theatre", "Specialty Coffee"],
    projects: ["Blog Strategy Overhaul", "SEO Content Sprints", "Newsletter Redesign"],
    initials: "LM",
    gradient: "from-amber-200 to-yellow-300",
    status: "active",
  },
  {
    id: 21,
    name: "Nathan Pierce",
    role: "Cloud Architect",
    department: "Engineering",
    email: "nathan@company.com",
    phone: "+1 555-0121",
    location: "Austin, TX",
    timezone: "CST (UTC−6)",
    manager: "Frank Chen",
    joined: "March 3, 2021",
    birthday: "September 9",
    pronouns: "he/him",
    education: "B.S. Computer Science, UT Austin",
    bio: "Designs scalable, cost-efficient cloud infrastructure. AWS certified and passionate about serverless patterns.",
    skills: ["AWS", "CDK", "Serverless", "Terraform"],
    certifications: ["AWS Solutions Architect Professional", "HashiCorp Terraform Associate"],
    languages: ["English"],
    interests: ["Home Automation", "Cycling", "Fantasy Football", "Woodworking"],
    projects: ["Multi-Region Failover", "FinOps Dashboard", "Serverless Migration"],
    initials: "NP",
    gradient: "from-blue-200 to-sky-300",
    status: "active",
  },
  {
    id: 22,
    name: "Olivia Chen",
    role: "People Partner",
    department: "Human Resources",
    email: "olivia@company.com",
    phone: "+1 555-0122",
    location: "New York, NY",
    timezone: "EST (UTC−5)",
    manager: "Eva Martinez",
    joined: "July 22, 2022",
    birthday: "January 20",
    pronouns: "she/her",
    education: "M.S. Organizational Psychology, Columbia University",
    bio: "Coaches leaders and teams through growth and change. Expert in organisational design and employee engagement.",
    skills: ["Coaching", "OD", "Engagement Surveys", "Compensation"],
    certifications: ["SHRM-SCP", "ICF Associate Certified Coach"],
    languages: ["English", "Mandarin"],
    interests: ["Meditation", "Book Clubs", "Yoga", "Travel"],
    projects: ["Manager Effectiveness Survey", "Comp Benchmarking", "Onboarding Experience Audit"],
    initials: "OC",
    gradient: "from-rose-200 to-pink-300",
    status: "active",
  },
  {
    id: 23,
    name: "Paulo Ferreira",
    role: "Sales Engineer",
    department: "Sales",
    email: "paulo@company.com",
    phone: "+1 555-0123",
    location: "São Paulo, Brazil",
    timezone: "BRT (UTC−3)",
    manager: "Henry Brown",
    joined: "October 10, 2022",
    birthday: "May 14",
    pronouns: "he/him",
    education: "B.Eng Computer Engineering, USP",
    bio: "Bridges technical depth and commercial savvy. Leads complex product demonstrations and proof-of-concept engagements.",
    skills: ["Demo Engineering", "APIs", "Salesforce", "Python"],
    certifications: ["Salesforce Sales Cloud Consultant", "AWS Cloud Practitioner"],
    languages: ["English", "Portuguese"],
    interests: ["Football", "Travel", "Brazilian Jiu-Jitsu", "Photography"],
    projects: ["EMEA PoC Engagements", "Demo Environment Rebuild", "Technical Proposal Library"],
    initials: "PF",
    gradient: "from-green-200 to-emerald-300",
    status: "busy",
  },
  {
    id: 24,
    name: "Quinn Zhao",
    role: "Machine Learning Engineer",
    department: "Analytics",
    email: "quinn@company.com",
    phone: "+1 555-0124",
    location: "San Francisco, CA",
    timezone: "PST (UTC−8)",
    manager: "Maya Patel",
    joined: "January 15, 2024",
    birthday: "November 11",
    pronouns: "they/them",
    education: "M.S. Computer Science (ML), Stanford University",
    bio: "Builds and ships ML models to production. Focused on feature engineering, model monitoring, and real-time inference.",
    skills: ["Python", "TensorFlow", "Kubeflow", "Feature Stores"],
    certifications: ["TensorFlow Developer Certificate", "AWS Machine Learning Specialty"],
    languages: ["English", "Mandarin"],
    interests: ["Competitive Gaming", "3D Printing", "Mathematics", "Rock Climbing"],
    projects: ["Real-Time Inference API", "Feature Store Migration", "Model Monitoring Dashboard"],
    initials: "QZ",
    gradient: "from-violet-200 to-purple-300",
    status: "active",
  },
  {
    id: 25,
    name: "Rachel Adams",
    role: "Scrum Master",
    department: "Product",
    email: "rachel@company.com",
    phone: "+1 555-0125",
    location: "Denver, CO",
    timezone: "MST (UTC−7)",
    manager: "Bob Smith",
    joined: "May 17, 2021",
    birthday: "July 25",
    pronouns: "she/her",
    education: "B.A. Business Management, University of Denver",
    bio: "Facilitates high-performing agile teams. Removes blockers fast and keeps ceremonies lean and valuable.",
    skills: ["Scrum", "Kanban", "Jira", "Facilitation"],
    certifications: ["Certified Scrum Master (CSM)", "SAFe 5 Agilist"],
    languages: ["English"],
    interests: ["Trail Running", "Agile Community", "Board Games", "Skiing"],
    projects: ["Sprint Velocity Improvement", "Retrospective Playbook", "Cross-Team Dependencies Map"],
    initials: "RA",
    gradient: "from-cyan-200 to-teal-300",
    status: "active",
  },
  {
    id: 26,
    name: "Samuel Osei",
    role: "Business Analyst",
    department: "Operations",
    email: "samuel@company.com",
    phone: "+1 555-0126",
    location: "Accra, Ghana",
    timezone: "GMT (UTC+0)",
    manager: "Amara Diallo",
    joined: "August 2, 2022",
    birthday: "March 2",
    pronouns: "he/him",
    education: "B.Sc Business Administration, University of Ghana",
    bio: "Translates business needs into requirements and processes. Comfortable with stakeholders from the C-suite to the front line.",
    skills: ["Requirements", "BPMN", "SQL", "Stakeholder Management"],
    certifications: ["CBAP (Certified Business Analysis Professional)"],
    languages: ["English", "Twi"],
    interests: ["Football", "Afrobeats", "Chess", "Community Volunteering"],
    projects: ["Procurement Process Redesign", "KPI Dashboard", "Stakeholder Mapping Exercise"],
    initials: "SO",
    gradient: "from-amber-200 to-orange-300",
    status: "away",
  },
  {
    id: 27,
    name: "Tanya Brooks",
    role: "Social Media Manager",
    department: "Marketing",
    email: "tanya@company.com",
    phone: "+1 555-0127",
    location: "Atlanta, GA",
    timezone: "EST (UTC−5)",
    manager: "Grace Kim",
    joined: "February 14, 2023",
    birthday: "October 8",
    pronouns: "she/her",
    education: "B.A. Communications, Spelman College",
    bio: "Grows engaged communities on every platform. Creative, data-savvy, and always up with the latest trends.",
    skills: ["Content Creation", "Analytics", "Paid Social", "Community"],
    certifications: ["Meta Blueprint Certified", "Google Analytics Certified"],
    languages: ["English"],
    interests: ["Fashion", "Atlanta Food Scene", "Dancing", "Podcasting"],
    projects: ["LinkedIn Growth Campaign", "Video Content Series", "Community Discord Launch"],
    initials: "TB",
    gradient: "from-pink-200 to-fuchsia-300",
    status: "active",
  },
  {
    id: 28,
    name: "Umar Farooq",
    role: "Infrastructure Engineer",
    department: "Engineering",
    email: "umar@company.com",
    phone: "+1 555-0128",
    location: "Karachi, Pakistan",
    timezone: "PKT (UTC+5)",
    manager: "Frank Chen",
    joined: "November 20, 2022",
    birthday: "February 19",
    pronouns: "he/him",
    education: "B.Eng Computer Systems Engineering, NED University",
    bio: "Manages on-prem and hybrid cloud infrastructure. Passionate about networking, storage, and Linux internals.",
    skills: ["Linux", "VMware", "Networking", "Ansible"],
    certifications: ["CCNA", "VMware VCP", "Red Hat RHCSA"],
    languages: ["English", "Urdu"],
    interests: ["Cricket", "Chess", "Electronics Tinkering", "Open Source"],
    projects: ["Data Centre Refresh", "Network Segmentation", "Storage Tiering Project"],
    initials: "UF",
    gradient: "from-gray-200 to-slate-300",
    status: "active",
  },
  {
    id: 29,
    name: "Vera Santos",
    role: "Graphic Designer",
    department: "Design",
    email: "vera@company.com",
    phone: "+1 555-0129",
    location: "Lisbon, Portugal",
    timezone: "WET (UTC+0)",
    manager: "Carol White",
    joined: "April 5, 2023",
    birthday: "June 28",
    pronouns: "she/her",
    education: "B.A. Fine Arts, Faculdade de Belas-Artes de Lisboa",
    bio: "Brings concepts to life through striking visuals. Expert in illustration, print, and digital campaigns.",
    skills: ["Photoshop", "Illustrator", "Figma", "Motion Graphics"],
    certifications: [],
    languages: ["English", "Portuguese"],
    interests: ["Ceramics", "Fado Music", "Travel Photography", "Surfing"],
    projects: ["Annual Report Design", "Social Media Templates", "Trade Show Collateral"],
    initials: "VS",
    gradient: "from-red-200 to-rose-300",
    status: "active",
  },
  {
    id: 30,
    name: "Walter Kim",
    role: "Account Executive",
    department: "Sales",
    email: "walter@company.com",
    phone: "+1 555-0130",
    location: "Chicago, IL",
    timezone: "CST (UTC−6)",
    manager: "Henry Brown",
    joined: "June 1, 2021",
    birthday: "August 4",
    pronouns: "he/him",
    education: "B.S. Business, DePaul University",
    bio: "Closes mid-market deals with a consultative approach. Strong at discovery, negotiation, and building long-term partnerships.",
    skills: ["Prospecting", "Salesforce", "Negotiation", "CRM"],
    certifications: ["Salesforce Certified Sales Cloud Consultant"],
    languages: ["English", "Korean"],
    interests: ["Golf", "Korean Cuisine", "Cycling", "Korean Drama"],
    projects: ["Mid-Market Q2 Pipeline", "Customer Advisory Board", "Expansion Opportunity Mapping"],
    initials: "WK",
    gradient: "from-indigo-200 to-blue-300",
    status: "busy",
  },
  {
    id: 31,
    name: "Xena Volkov",
    role: "Research Scientist",
    department: "Analytics",
    email: "xena@company.com",
    phone: "+1 555-0131",
    location: "Stockholm, Sweden",
    timezone: "CET (UTC+1)",
    manager: "Maya Patel",
    joined: "September 12, 2023",
    birthday: "December 21",
    pronouns: "she/her",
    education: "Ph.D. Statistics, Stockholm University",
    bio: "Advances the company's understanding of user behaviour through rigorous experimentation and causal inference.",
    skills: ["Causal Inference", "R", "Python", "A/B Testing"],
    certifications: ["Google Analytics Certified"],
    languages: ["English", "Swedish", "Russian"],
    interests: ["Cross-Country Skiing", "Statistical Art", "Chess", "Baking"],
    projects: ["A/B Test Framework Overhaul", "User Behaviour Study", "Causal Model for Retention"],
    initials: "XV",
    gradient: "from-teal-200 to-cyan-300",
    status: "active",
  },
  {
    id: 32,
    name: "Yara Al-Rashid",
    role: "Compliance Officer",
    department: "Legal",
    email: "yara@company.com",
    phone: "+1 555-0132",
    location: "Riyadh, Saudi Arabia",
    timezone: "AST (UTC+3)",
    manager: "Priya Sharma",
    joined: "March 27, 2022",
    birthday: "April 17",
    pronouns: "she/her",
    education: "LLM, King Saud University",
    bio: "Ensures the company meets regulatory obligations across multiple jurisdictions. Methodical, detail-focused, and proactive.",
    skills: ["Regulatory Compliance", "Risk Assessment", "AML", "Audit"],
    certifications: ["CAMS (Certified Anti-Money Laundering Specialist)", "CIPP/E"],
    languages: ["English", "Arabic"],
    interests: ["Arabic Literature", "Equestrian Sports", "Travel", "Calligraphy"],
    projects: ["GDPR Audit", "AML Policy Update", "Cross-Border Compliance Framework"],
    initials: "YA",
    gradient: "from-yellow-200 to-lime-300",
    status: "active",
  },
  {
    id: 33,
    name: "Zack Monroe",
    role: "IT Support Specialist",
    department: "Operations",
    email: "zack@company.com",
    phone: "+1 555-0133",
    location: "Phoenix, AZ",
    timezone: "MST (UTC−7)",
    manager: "Amara Diallo",
    joined: "December 1, 2021",
    birthday: "September 30",
    pronouns: "he/him",
    education: "A.S. Information Technology, Arizona State University",
    bio: "First line of defence for every technical hurdle. Empathetic communicator who resolves issues fast and documents everything.",
    skills: ["Help Desk", "Endpoint Management", "Scripting", "ITIL"],
    certifications: ["CompTIA A+", "ITIL 4 Foundation"],
    languages: ["English"],
    interests: ["Mountain Biking", "Home Automation", "Gaming", "Amateur Radio"],
    projects: ["Asset Inventory Refresh", "Helpdesk Automation", "MDM Rollout"],
    initials: "ZM",
    gradient: "from-orange-200 to-amber-300",
    status: "active",
  },
  {
    id: 34,
    name: "Aisha Kamara",
    role: "Recruiter",
    department: "Human Resources",
    email: "aisha@company.com",
    phone: "+1 555-0134",
    location: "Nairobi, Kenya",
    timezone: "EAT (UTC+3)",
    manager: "Eva Martinez",
    joined: "February 7, 2023",
    birthday: "January 14",
    pronouns: "she/her",
    education: "B.A. Human Resources, University of Nairobi",
    bio: "Connects talented people with the right roles. Specialist in technical and leadership hiring across global markets.",
    skills: ["Sourcing", "Interviewing", "ATS", "Employer Branding"],
    certifications: ["SHRM Talent Acquisition Specialty"],
    languages: ["English", "Swahili"],
    interests: ["Wildlife Photography", "Afrobeats", "Mentoring Youth", "Running"],
    projects: ["Engineering Hiring Sprint", "TA Process Improvement", "University Partnership Programme"],
    initials: "AK",
    gradient: "from-emerald-200 to-green-300",
    status: "active",
  },
  {
    id: 35,
    name: "Brett Harrison",
    role: "Product Designer",
    department: "Design",
    email: "brett@company.com",
    phone: "+1 555-0135",
    location: "Portland, OR",
    timezone: "PST (UTC−8)",
    manager: "Carol White",
    joined: "July 14, 2022",
    birthday: "May 22",
    pronouns: "he/him",
    education: "B.F.A. Industrial Design, RISD",
    bio: "Merges user empathy with systematic thinking to ship intuitive product experiences. Strong in zero-to-one design phases.",
    skills: ["Figma", "Design Thinking", "Wireframing", "Research"],
    certifications: [],
    languages: ["English"],
    interests: ["Skateboarding", "Industrial Design Collecting", "Photography", "Hiking"],
    projects: ["Mobile App Zero-to-One", "Design Sprint Series", "User Interview Programme"],
    initials: "BH",
    gradient: "from-sky-200 to-indigo-300",
    status: "away",
  },
  {
    id: 36,
    name: "Chloe Dupont",
    role: "Finance Manager",
    department: "Finance",
    email: "chloe@company.com",
    phone: "+1 555-0136",
    location: "Montreal, Canada",
    timezone: "EST (UTC−5)",
    manager: "Karen Liu",
    joined: "October 3, 2020",
    birthday: "October 15",
    pronouns: "she/her",
    education: "B.Com Accounting, McGill University",
    bio: "Leads budgeting, forecasting, and financial close. Passionate about automating repetitive finance workflows.",
    skills: ["Budgeting", "ERP", "Excel", "Forecasting"],
    certifications: ["CPA", "CMA (Certified Management Accountant)"],
    languages: ["English", "French"],
    interests: ["Skiing", "Wine Tasting", "Cycling", "Jazz Music"],
    projects: ["Annual Budget Cycle", "Finance Automation Initiative", "Board Reporting Templates"],
    initials: "CD",
    gradient: "from-purple-200 to-violet-300",
    status: "active",
  },
  {
    id: 37,
    name: "Diego Reyes",
    role: "Growth Marketer",
    department: "Marketing",
    email: "diego@company.com",
    phone: "+1 555-0137",
    location: "Mexico City, Mexico",
    timezone: "CST (UTC−6)",
    manager: "Grace Kim",
    joined: "January 30, 2023",
    birthday: "July 9",
    pronouns: "he/him",
    education: "B.S. Marketing, ITAM",
    bio: "Runs experiments across the funnel to drive sustainable user growth. Lives in dashboards and A/B test results.",
    skills: ["Paid Ads", "Conversion Optimisation", "Analytics", "Email Marketing"],
    certifications: ["Google Ads Certified", "Meta Blueprint Certified"],
    languages: ["English", "Spanish"],
    interests: ["Football", "DJing", "Salsa Dancing", "Travel"],
    projects: ["Paid Acquisition Overhaul", "Conversion Rate Experiments", "Referral Programme Launch"],
    initials: "DR",
    gradient: "from-rose-200 to-red-300",
    status: "active",
  },
  {
    id: 38,
    name: "Elena Sokolova",
    role: "Platform Engineer",
    department: "Engineering",
    email: "elena@company.com",
    phone: "+1 555-0138",
    location: "Warsaw, Poland",
    timezone: "CET (UTC+1)",
    manager: "Frank Chen",
    joined: "April 19, 2022",
    birthday: "March 7",
    pronouns: "she/her",
    education: "M.Sc Computer Science, Warsaw University of Technology",
    bio: "Builds the internal platforms that make every other engineer faster. Obsessed with developer productivity and golden paths.",
    skills: ["Go", "Platform Engineering", "Backstage", "CI/CD"],
    certifications: ["CKA (Certified Kubernetes Administrator)", "HashiCorp Terraform Associate"],
    languages: ["English", "Polish", "Russian"],
    interests: ["Climbing", "Open Source", "Sci-Fi Books", "Cooking"],
    projects: ["Internal Developer Portal", "Golden Path Templates", "Incident Tooling Upgrade"],
    initials: "ES",
    gradient: "from-fuchsia-200 to-purple-300",
    status: "active",
  },
  {
    id: 39,
    name: "Felix Wagner",
    role: "Solution Architect",
    department: "Sales",
    email: "felix@company.com",
    phone: "+1 555-0139",
    location: "Munich, Germany",
    timezone: "CET (UTC+1)",
    manager: "Henry Brown",
    joined: "August 25, 2021",
    birthday: "November 26",
    pronouns: "he/him",
    education: "M.Sc Enterprise Architecture, TU Munich",
    bio: "Designs enterprise-scale solutions tailored to client needs. Deep knowledge of integration patterns and cloud migrations.",
    skills: ["Architecture", "AWS", "APIs", "Enterprise Sales"],
    certifications: ["AWS Solutions Architect Professional", "TOGAF 9"],
    languages: ["English", "German"],
    interests: ["Hiking", "German Literature", "Home Brewing", "Sailing"],
    projects: ["EMEA Enterprise Deals", "Reference Architecture Library", "Cloud Migration Blueprints"],
    initials: "FW",
    gradient: "from-blue-200 to-cyan-300",
    status: "active",
  },
  {
    id: 40,
    name: "Gina Tanaka",
    role: "Office Manager",
    department: "Operations",
    email: "gina@company.com",
    phone: "+1 555-0140",
    location: "Osaka, Japan",
    timezone: "JST (UTC+9)",
    manager: "Amara Diallo",
    joined: "May 9, 2020",
    birthday: "February 8",
    pronouns: "she/her",
    education: "B.A. Business Administration, Osaka University",
    bio: "Runs a seamless office experience and keeps culture alive for in-person and remote teams alike.",
    skills: ["Facilities", "Event Planning", "Vendor Relations", "Culture"],
    certifications: [],
    languages: ["English", "Japanese"],
    interests: ["Tea Ceremony", "Ikebana", "Travel", "Pottery"],
    projects: ["Office Expansion Planning", "Wellness Programme", "Global Event Calendar"],
    initials: "GT",
    gradient: "from-lime-200 to-teal-300",
    status: "active",
  },
  {
    id: 41,
    name: "Hugo Morales",
    role: "Senior Product Manager",
    department: "Product",
    email: "hugo@company.com",
    phone: "+1 555-0141",
    location: "Miami, FL",
    timezone: "EST (UTC−5)",
    manager: "Bob Smith",
    joined: "March 22, 2021",
    birthday: "June 3",
    pronouns: "he/him",
    education: "B.S. Computer Science + MBA, University of Miami",
    bio: "Leads the platform product area with a focus on developer tools and API monetisation. Former software engineer.",
    skills: ["API Strategy", "Roadmapping", "SQL", "Go-to-Market"],
    certifications: ["CSPO", "AWS Cloud Practitioner"],
    languages: ["English", "Spanish"],
    interests: ["Surfing", "Latin Jazz", "Product Communities", "Cooking"],
    projects: ["API Monetisation Strategy", "Developer Portal Roadmap", "Partner Integration Programme"],
    initials: "HM",
    gradient: "from-amber-200 to-red-300",
    status: "busy",
  },
  {
    id: 42,
    name: "Ingrid Larsen",
    role: "Data Engineer",
    department: "Analytics",
    email: "ingrid@company.com",
    phone: "+1 555-0142",
    location: "Oslo, Norway",
    timezone: "CET (UTC+1)",
    manager: "David Lee",
    joined: "June 6, 2023",
    birthday: "August 16",
    pronouns: "she/her",
    education: "M.Sc Data Science, University of Oslo",
    bio: "Builds reliable data pipelines and lakehouses that the whole analytics team depends on. Advocate for data quality.",
    skills: ["Spark", "dbt", "Airflow", "Snowflake"],
    certifications: ["dbt Certified Developer", "Databricks Certified Associate Developer"],
    languages: ["English", "Norwegian"],
    interests: ["Cross-Country Skiing", "Data Art", "Hiking", "Photography"],
    projects: ["Lakehouse Architecture", "Pipeline Reliability Initiative", "Data Quality Framework"],
    initials: "IL",
    gradient: "from-cyan-200 to-blue-300",
    status: "active",
  },
  { id: 43, name: "Jordan Kim", role: "Frontend Engineer", department: "Engineering", email: "jordan@company.com", phone: "+1 555-0143", location: "Austin, TX", timezone: "CST (UTC−6)", manager: "Alice Johnson", joined: "August 1, 2023", birthday: "March 9", pronouns: "they/them", education: "B.S. Computer Science, UT Austin", bio: "Builds fast, accessible interfaces with a strong eye for detail. Advocates for semantic HTML and inclusive design.", skills: ["React", "TypeScript", "Accessibility", "CSS"], certifications: ["CPACC (Accessibility)"], languages: ["English"], interests: ["Indie Games", "Skateboarding", "Graphic Novels", "3D Printing"], projects: ["Accessibility Audit", "Component Library v2", "Dark Mode Implementation"], initials: "JK", gradient: "from-violet-200 to-purple-300", status: "active" },
  { id: 44, name: "Kenji Watanabe", role: "Cloud Engineer", department: "Engineering", email: "kenji@company.com", phone: "+81 90-0144", location: "Osaka, Japan", timezone: "JST (UTC+9)", manager: "Frank Chen", joined: "April 17, 2022", birthday: "November 21", pronouns: "he/him", education: "B.Eng Computer Engineering, Osaka University", bio: "Specialises in cloud cost optimisation and infrastructure automation. Passionate about green computing and efficiency.", skills: ["AWS", "CDK", "Python", "FinOps"], certifications: ["AWS Solutions Architect Pro", "AWS DevOps Engineer Pro"], languages: ["Japanese", "English"], interests: ["Bonsai", "Cycling", "Anime", "Home Automation"], projects: ["Cost Optimisation Initiative", "Multi-Region Failover", "Cloud Migration Phase 2"], initials: "KW", gradient: "from-teal-200 to-emerald-300", status: "active" },
  { id: 45, name: "Lucia Fernandez", role: "Brand Designer", department: "Design", email: "lucia@company.com", phone: "+34 6-0145", location: "Barcelona, Spain", timezone: "CET (UTC+1)", manager: "Carol White", joined: "February 20, 2023", birthday: "May 30", pronouns: "she/her", education: "B.A. Graphic Design, Elisava Barcelona", bio: "Shapes brand identity with a background in fine art and motion. Brings warmth and cohesion to every visual touchpoint.", skills: ["Illustrator", "Brand Identity", "Motion Design", "Typography"], certifications: [], languages: ["Spanish", "English", "Catalan"], interests: ["Contemporary Art", "Dance", "Architecture", "Film"], projects: ["Brand Guidelines Refresh", "Icon System", "Launch Campaign Visual Identity"], initials: "LF", gradient: "from-fuchsia-200 to-pink-300", status: "active" },
  { id: 46, name: "Marcus Hill", role: "Enterprise AE", department: "Sales", email: "marcus@company.com", phone: "+1 555-0146", location: "Chicago, IL", timezone: "CST (UTC−6)", manager: "Henry Brown", joined: "December 1, 2021", birthday: "August 18", pronouns: "he/him", education: "B.B.A. Finance, DePaul University", bio: "Lands and expands strategic accounts. Comfortable running complex multi-threaded deals across C-suite stakeholders.", skills: ["Enterprise Sales", "EBR", "Negotiation", "CRM"], certifications: ["Salesforce Certified Sales Cloud Consultant"], languages: ["English"], interests: ["American Football", "Jazz", "Mentoring", "Entrepreneurship"], projects: ["Q2 Enterprise Pipeline", "Fortune 500 Expansion", "Strategic Account Reviews"], initials: "MH", gradient: "from-slate-200 to-blue-300", status: "active" },
  { id: 47, name: "Nina Kapoor", role: "Analytics Engineer", department: "Analytics", email: "nina@company.com", phone: "+91 97-0147", location: "Mumbai, India", timezone: "IST (UTC+5:30)", manager: "David Lee", joined: "February 7, 2023", birthday: "October 14", pronouns: "she/her", education: "B.Tech Computer Science, IIT Bombay", bio: "Bridges raw data and BI tooling. Builds the semantic layer and pipelines that feed dashboards leadership trusts.", skills: ["dbt", "SQL", "Power BI", "Data Modeling"], certifications: ["dbt Certified Developer", "Microsoft PL-300"], languages: ["Hindi", "English", "Marathi"], interests: ["Kathak Dance", "Cricket", "Financial Markets", "Reading"], projects: ["Semantic Layer Build-out", "Executive Dashboard", "Data Catalog"], initials: "NK", gradient: "from-orange-200 to-red-300", status: "active" },
  { id: 48, name: "Oscar Grant", role: "Operations Analyst", department: "Operations", email: "oscar@company.com", phone: "+44 7800-0148", location: "London, UK", timezone: "GMT (UTC+0)", manager: "Amara Diallo", joined: "July 19, 2022", birthday: "January 25", pronouns: "he/him", education: "B.Sc Business Management, King's College London", bio: "Keeps the business running smoothly by identifying bottlenecks and designing leaner processes.", skills: ["Operations", "Procurement", "Asana", "Vendor Management"], certifications: ["PRINCE2 Foundation"], languages: ["English", "French"], interests: ["Football (Soccer)", "Jazz Piano", "Travel", "Documentary Films"], projects: ["Vendor Renegotiation", "Process Audit", "Ops OKR Framework"], initials: "OG", gradient: "from-cyan-200 to-sky-300", status: "busy" },
  { id: 49, name: "Paula Reed", role: "Senior Product Manager", department: "Product", email: "paula@company.com", phone: "+1 555-0149", location: "Boston, MA", timezone: "EST (UTC−5)", manager: "Bob Smith", joined: "April 26, 2021", birthday: "December 3", pronouns: "she/her", education: "MBA, MIT Sloan", bio: "Veteran PM who has shipped zero-to-one and scaled zero-to-millions. Pushes for ruthless prioritisation and outcome focus.", skills: ["Product Strategy", "Roadmapping", "Agile", "OKRs"], certifications: ["CSPO", "PMP"], languages: ["English"], interests: ["Sailing", "Economics", "Mentoring", "Public Speaking"], projects: ["Search Revamp", "Monetisation Strategy", "Q4 Planning"], initials: "PR", gradient: "from-violet-200 to-fuchsia-300", status: "active" },
  { id: 50, name: "Quentin Bell", role: "QA Lead", department: "Engineering", email: "quentin@company.com", phone: "+33 6-0150", location: "Paris, France", timezone: "CET (UTC+1)", manager: "Frank Chen", joined: "October 4, 2022", birthday: "September 7", pronouns: "he/him", education: "M.Sc Software Engineering, École Polytechnique", bio: "Champions quality at every stage of delivery. Builds test infrastructure and drives a culture where quality is everyone's job.", skills: ["Playwright", "Quality Strategy", "CI/CD", "Test Automation"], certifications: ["ISTQB Advanced Level"], languages: ["French", "English"], interests: ["Chess", "Cycling", "Philosophy", "Electronic Music"], projects: ["E2E Test Suite", "Quality KPI Dashboard", "Test Flakiness Elimination"], initials: "QB", gradient: "from-sky-200 to-indigo-300", status: "active" },
  { id: 51, name: "Rosa Sanchez", role: "Paralegal", department: "Legal", email: "rosa@company.com", phone: "+34 6-0151", location: "Madrid, Spain", timezone: "CET (UTC+1)", manager: "Priya Sharma", joined: "May 28, 2023", birthday: "February 14", pronouns: "she/her", education: "Law Degree, Universidad Complutense de Madrid", bio: "Supports legal ops with contract review, trademark filings, and regulatory submissions. Meticulous and fast.", skills: ["Contract Review", "IP", "Trademarks", "Legal Ops"], certifications: [], languages: ["Spanish", "English", "Portuguese"], interests: ["Flamenco", "Reading Legal Thrillers", "Painting", "Running"], projects: ["IP Registration Drive", "Contract Template Library", "GDPR Audit"], initials: "RS", gradient: "from-rose-200 to-red-300", status: "active" },
  { id: 52, name: "Sebastian Clark", role: "Full Stack Engineer", department: "Engineering", email: "sebastian@company.com", phone: "+49 151-0152", location: "Berlin, Germany", timezone: "CET (UTC+1)", manager: "Alice Johnson", joined: "August 10, 2021", birthday: "July 2", pronouns: "he/him", education: "B.Sc Computer Science, TU Berlin", bio: "Comfortable across the whole stack — from database schema to pixel-perfect UI. Loves the challenge of end-to-end ownership.", skills: ["TypeScript", "PostgreSQL", "React", "Docker"], certifications: [], languages: ["German", "English"], interests: ["Climbing", "Open Source", "Electronic Music Production", "Coffee"], projects: ["Billing Engine", "Admin Panel Rewrite", "API Rate Limiting"], initials: "SC", gradient: "from-indigo-200 to-cyan-300", status: "active" },
  { id: 53, name: "Tara Singh", role: "Head of People", department: "Human Resources", email: "tara@company.com", phone: "+1 555-0153", location: "New York, NY", timezone: "EST (UTC−5)", manager: "Eva Martinez", joined: "November 15, 2020", birthday: "March 26", pronouns: "she/her", education: "M.A. Organisational Psychology, NYU", bio: "Sets people strategy at the executive level. Owns hiring plans, compensation frameworks, and DE&I programmes company-wide.", skills: ["People Strategy", "Comp & Benefits", "DE&I", "Org Design"], certifications: ["SHRM-SCP"], languages: ["English", "Punjabi"], interests: ["Meditation", "Cooking", "DEI Advocacy", "Running"], projects: ["Compensation Benchmarking", "Leadership Development Programme", "ERG Launch"], initials: "TS", gradient: "from-amber-200 to-rose-300", status: "active" },
  { id: 54, name: "Uma Patel", role: "Financial Controller", department: "Finance", email: "uma@company.com", phone: "+65 9-0154", location: "Singapore", timezone: "SGT (UTC+8)", manager: "Karen Liu", joined: "March 1, 2023", birthday: "April 4", pronouns: "she/her", education: "B.Acc Accountancy, NUS Business School", bio: "Manages month-end close, financial controls, and audit preparation for APAC. Keeps the books clean and the auditors satisfied.", skills: ["Financial Close", "IFRS", "SAP", "Internal Controls"], certifications: ["CPA (Singapore)", "CFA Level 1"], languages: ["English", "Gujarati", "Mandarin"], interests: ["Badminton", "Cooking", "Travel", "Yoga"], projects: ["APAC Close Automation", "Internal Controls Review", "ERP Upgrade"], initials: "UP", gradient: "from-teal-200 to-blue-300", status: "away" },
  { id: 55, name: "Victor Cruz", role: "Customer Success Lead", department: "Sales", email: "victor@company.com", phone: "+52 55-0155", location: "Mexico City, Mexico", timezone: "CST (UTC−6)", manager: "Omar Hassan", joined: "July 5, 2022", birthday: "June 28", pronouns: "he/him", education: "B.A. Business, ITAM Mexico City", bio: "Leads a team of CSMs across LATAM, driving retention and expansion. Deep expertise in onboarding and executive business reviews.", skills: ["CSM Leadership", "EBR", "Expansion Revenue", "Gainsight"], certifications: ["Gainsight Certified"], languages: ["Spanish", "English", "Portuguese"], interests: ["Football", "Salsa Dancing", "Travel", "Entrepreneurship"], projects: ["LATAM Onboarding Playbook", "Churn Reduction Initiative", "QBR Template Overhaul"], initials: "VC", gradient: "from-green-200 to-lime-300", status: "active" },
  { id: 56, name: "Wendy Zhang", role: "Research Scientist", department: "Analytics", email: "wendy@company.com", phone: "+1 555-0156", location: "Palo Alto, CA", timezone: "PST (UTC−8)", manager: "David Lee", joined: "January 16, 2023", birthday: "October 31", pronouns: "she/her", education: "Ph.D. Machine Learning, Stanford University", bio: "Advances the state of the art through rigorous research. Publications in NeurIPS and ICLR; multiple patents pending.", skills: ["ML Research", "NLP", "Python", "Publications"], certifications: [], languages: ["Mandarin", "English"], interests: ["Piano", "Go (board game)", "Hiking", "Academic Journals"], projects: ["LLM Fine-Tuning Research", "Bias Detection Framework", "Search Ranking Model"], initials: "WZ", gradient: "from-fuchsia-200 to-indigo-300", status: "active" },
  { id: 57, name: "Xavier Dupont", role: "Infrastructure Engineer", department: "Engineering", email: "xavier@company.com", phone: "+33 6-0157", location: "Paris, France", timezone: "CET (UTC+1)", manager: "Frank Chen", joined: "September 22, 2021", birthday: "February 9", pronouns: "he/him", education: "Engineering Degree, École des Mines de Paris", bio: "Designs and operates on-prem and hybrid infrastructure. Bare metal, networking, and storage are second nature to him.", skills: ["Linux", "Networking", "Storage", "Bare Metal"], certifications: ["RHCE", "Cisco CCNA"], languages: ["French", "English"], interests: ["Rock Music", "Motorcycles", "Board Games", "Photography"], projects: ["Data Center Upgrade", "Network Segmentation", "Storage Tiering"], initials: "XD", gradient: "from-gray-200 to-slate-300", status: "busy" },
  { id: 58, name: "Yasmin Ali", role: "Campaigns Manager", department: "Marketing", email: "yasmin@company.com", phone: "+20 100-0158", location: "Cairo, Egypt", timezone: "EET (UTC+2)", manager: "Grace Kim", joined: "April 8, 2022", birthday: "July 19", pronouns: "she/her", education: "B.A. Mass Communication, American University in Cairo", bio: "Plans and executes integrated campaigns across paid, earned, and owned channels. Strong at attribution modelling and budget pacing.", skills: ["Campaign Management", "Paid Media", "Attribution", "HubSpot"], certifications: ["Google Ads Certified", "Meta Blueprint"], languages: ["Arabic", "English", "French"], interests: ["Photography", "Travel", "Arabic Calligraphy", "Volunteering"], projects: ["MENA Launch Campaign", "Paid Media Overhaul", "Attribution Model Rebuild"], initials: "YA", gradient: "from-pink-200 to-orange-300", status: "active" },
  { id: 59, name: "Zara Khan", role: "Interaction Designer", department: "Design", email: "zara@company.com", phone: "+61 4-0159", location: "Sydney, Australia", timezone: "AEST (UTC+10)", manager: "Carol White", joined: "December 17, 2022", birthday: "May 5", pronouns: "she/her", education: "B.Des Interaction Design, UNSW Sydney", bio: "Designs micro-interactions and flows that feel effortless. Expert in motion design and high-fidelity prototyping.", skills: ["Interaction Design", "Motion", "ProtoPie", "Figma"], certifications: [], languages: ["English", "Urdu"], interests: ["Surfing", "Oil Painting", "Travel", "Indie Music"], projects: ["Checkout Flow Redesign", "Animation Principles Guide", "Navigation IA Overhaul"], initials: "ZK", gradient: "from-cyan-200 to-violet-300", status: "active" },
  { id: 60, name: "Alex Morgan", role: "Growth PM", department: "Product", email: "alex@company.com", phone: "+1 555-0160", location: "San Francisco, CA", timezone: "PST (UTC−8)", manager: "Bob Smith", joined: "February 24, 2024", birthday: "August 27", pronouns: "they/them", education: "B.S. Industrial Engineering, Stanford University", bio: "Drives growth through product-led experiments. Obsessed with activation funnels, referral loops, and sustainable acquisition.", skills: ["Growth", "Experimentation", "SQL", "Activation"], certifications: ["Reforge Growth Series"], languages: ["English"], interests: ["Trail Running", "Behavioural Economics", "Podcasts", "Improv Comedy"], projects: ["Activation Rate Improvement", "Referral Programme v2", "Onboarding A/B Tests"], initials: "AM", gradient: "from-lime-200 to-teal-300", status: "active" },
  { id: 61, name: "Brooke Evans", role: "Content Writer", department: "Marketing", email: "brooke@company.com", phone: "+1 555-0161", location: "Nashville, TN", timezone: "CST (UTC−6)", manager: "Grace Kim", joined: "May 10, 2023", birthday: "September 12", pronouns: "she/her", education: "B.A. English Literature, Vanderbilt University", bio: "Crafts compelling long-form content that drives SEO and builds authority. Turns complex technical topics into approachable reads.", skills: ["Long-Form Writing", "SEO", "CMS", "Editing"], certifications: ["HubSpot Content Marketing Certified"], languages: ["English"], interests: ["Country Music", "Hiking", "Fiction Writing", "Coffee"], projects: ["Developer Blog Revamp", "Content SEO Audit", "Case Study Library"], initials: "BE", gradient: "from-rose-200 to-pink-300", status: "active" },
  { id: 62, name: "Carlos Reyes", role: "Mobile Engineer", department: "Engineering", email: "carlosr@company.com", phone: "+52 55-0162", location: "Guadalajara, Mexico", timezone: "CST (UTC−6)", manager: "Leo Nguyen", joined: "July 3, 2023", birthday: "March 17", pronouns: "he/him", education: "B.Sc Computer Science, ITESO Guadalajara", bio: "Builds fast, delightful mobile apps on iOS. Cares deeply about performance, smooth animations, and App Store ratings.", skills: ["Swift", "SwiftUI", "Xcode", "Core Data"], certifications: ["Apple Certified iOS Developer"], languages: ["Spanish", "English"], interests: ["Football", "Indie Bands", "Photography", "Home Cooking"], projects: ["iOS App Rewrite", "Push Notification System", "App Store Optimisation"], initials: "CR", gradient: "from-orange-200 to-amber-300", status: "active" },
  { id: 63, name: "Diana Walsh", role: "Finance Manager", department: "Finance", email: "diana@company.com", phone: "+353 87-0163", location: "Dublin, Ireland", timezone: "GMT (UTC+0)", manager: "Karen Liu", joined: "October 31, 2020", birthday: "January 29", pronouns: "she/her", education: "B.Comm Accounting, University College Dublin", bio: "Owns financial planning, budgeting, and reporting for the EMEA region. Keeps stakeholders informed and forecasts accurate.", skills: ["FP&A", "Excel", "NetSuite", "Budgeting"], certifications: ["ACCA", "CPA Ireland"], languages: ["English", "Irish"], interests: ["Gaelic Football", "Book Club", "Running", "Cooking"], projects: ["EMEA Budget Cycle", "FX Hedging Review", "Finance Automation"], initials: "DW", gradient: "from-indigo-200 to-blue-300", status: "active" },
  { id: 64, name: "Ethan Brooks", role: "Product Analyst", department: "Product", email: "ethan@company.com", phone: "+1 555-0164", location: "Boston, MA", timezone: "EST (UTC−5)", manager: "Bob Smith", joined: "April 12, 2022", birthday: "November 11", pronouns: "he/him", education: "B.S. Economics + Statistics, Tufts University", bio: "Sits at the intersection of product and data. Defines success metrics, runs experiments, and answers 'is this actually working?'", skills: ["Product Analytics", "SQL", "Mixpanel", "Experimentation"], certifications: ["Product Analytics Certification (Mixpanel)"], languages: ["English"], interests: ["Basketball", "Cooking", "Behavioural Finance", "Cycling"], projects: ["Retention Metrics Framework", "Feature Flag Analysis", "User Journey Mapping"], initials: "EB", gradient: "from-teal-200 to-cyan-300", status: "away" },
  { id: 65, name: "Fatima Al-Rashid", role: "UX Researcher", department: "Design", email: "fatima@company.com", phone: "+971 50-0165", location: "Abu Dhabi, UAE", timezone: "GST (UTC+4)", manager: "Carol White", joined: "September 5, 2022", birthday: "April 22", pronouns: "she/her", education: "M.Sc Human-Computer Interaction, Khalifa University", bio: "Uncovers the needs behind user behaviour through rigorous research. Translates insights into actionable design recommendations.", skills: ["User Interviews", "Usability Testing", "Synthesis", "Research Ops"], certifications: ["Nielsen Norman UX Research"], languages: ["Arabic", "English", "French"], interests: ["Calligraphy", "Philosophy", "Swimming", "Travel"], projects: ["MENA User Research", "Accessibility Study", "Jobs-to-be-Done Mapping"], initials: "FA", gradient: "from-emerald-200 to-green-300", status: "active" },
  { id: 66, name: "George Patel", role: "Platform Engineer", department: "Engineering", email: "george@company.com", phone: "+91 98-0166", location: "Bangalore, India", timezone: "IST (UTC+5:30)", manager: "Frank Chen", joined: "August 15, 2022", birthday: "December 16", pronouns: "he/him", education: "B.Tech Computer Science, IIT Madras", bio: "Builds and maintains the internal developer platform. Makes deploying a service as straightforward as filling in a YAML file.", skills: ["Platform Engineering", "Backstage", "Kubernetes", "Go"], certifications: ["CKA", "AWS Solutions Architect"], languages: ["Hindi", "English", "Kannada"], interests: ["Badminton", "Sci-Fi", "Home Automation", "Open Source"], projects: ["Internal Developer Portal", "Service Catalogue", "Golden Path Templates"], initials: "GP", gradient: "from-green-200 to-teal-300", status: "active" },
  { id: 67, name: "Hannah Lee", role: "Social Media Manager", department: "Marketing", email: "hannah@company.com", phone: "+1 555-0167", location: "Los Angeles, CA", timezone: "PST (UTC−8)", manager: "Grace Kim", joined: "November 8, 2021", birthday: "August 6", pronouns: "she/her", education: "B.A. Communications, USC Annenberg", bio: "Grows engaged communities on social. Manages the content calendar, brand voice, and creator partnerships across all channels.", skills: ["Content Creation", "Social Strategy", "Canva", "Analytics"], certifications: ["Meta Blueprint Certified", "Hootsuite Certified"], languages: ["English", "Korean"], interests: ["K-Pop", "Fashion", "Hiking", "Film Photography"], projects: ["TikTok Channel Launch", "Creator Partnership Programme", "Social Brand Guidelines"], initials: "HL", gradient: "from-rose-200 to-fuchsia-300", status: "active" },
  { id: 68, name: "Ian Foster", role: "Security Analyst", department: "Engineering", email: "ian@company.com", phone: "+1 555-0168", location: "Washington, DC", timezone: "EST (UTC−5)", manager: "Jake Thompson", joined: "June 30, 2022", birthday: "October 8", pronouns: "he/him", education: "B.S. Cybersecurity, George Washington University", bio: "Hunts threats before they become incidents. Runs the SIEM, leads red-team exercises, and owns security awareness training.", skills: ["SIEM", "Threat Hunting", "Python", "Security Ops"], certifications: ["OSCP", "CompTIA Security+"], languages: ["English"], interests: ["CTF Competitions", "Lock Sport", "Sci-Fi", "Brewing"], projects: ["SIEM Deployment", "Phishing Simulation", "Zero Trust Architecture"], initials: "IF", gradient: "from-zinc-200 to-slate-300", status: "active" },
  { id: 69, name: "Julia Kim", role: "People Partner", department: "Human Resources", email: "julia@company.com", phone: "+1 555-0169", location: "San Francisco, CA", timezone: "PST (UTC−8)", manager: "Eva Martinez", joined: "January 20, 2023", birthday: "June 11", pronouns: "she/her", education: "B.A. Psychology, UC San Diego", bio: "Partners with business leaders to build high-performing teams. Coaches managers through difficult conversations and change.", skills: ["HRBP", "OKRs", "Coaching", "Culture"], certifications: ["ICF Associate Certified Coach"], languages: ["English", "Korean"], interests: ["Yoga", "Cooking", "Reading", "Volunteering"], projects: ["Manager Effectiveness Programme", "People Pulse Survey", "DEI Roadmap"], initials: "JK", gradient: "from-pink-200 to-rose-300", status: "active" },
  { id: 70, name: "Kevin Zhao", role: "API Engineer", department: "Engineering", email: "kevin@company.com", phone: "+1 555-0170", location: "Seattle, WA", timezone: "PST (UTC−8)", manager: "Alice Johnson", joined: "March 25, 2021", birthday: "July 30", pronouns: "he/him", education: "B.S. Computer Science, University of Washington", bio: "Designs and maintains the APIs that power our partner ecosystem. Deeply cares about developer experience and backwards compatibility.", skills: ["API Design", "REST", "OpenAPI", "Node.js"], certifications: ["AWS Developer Associate"], languages: ["Mandarin", "English"], interests: ["Distance Running", "Cooking", "Science Fiction", "Open Source"], projects: ["Public API v3", "Developer SDK", "API Gateway Migration"], initials: "KZ", gradient: "from-blue-200 to-violet-300", status: "active" },
  { id: 71, name: "Lily Turner", role: "Visual Designer", department: "Design", email: "lily@company.com", phone: "+1 555-0171", location: "New York, NY", timezone: "EST (UTC−5)", manager: "Carol White", joined: "September 14, 2022", birthday: "January 17", pronouns: "she/her", education: "B.F.A. Graphic Design, Parsons School of Design", bio: "Creates visual systems that scale across products and channels. Expert in illustration, iconography, and type.", skills: ["Illustration", "Iconography", "After Effects", "Figma"], certifications: [], languages: ["English", "Italian"], interests: ["Printmaking", "Architecture", "Jazz", "Vintage Fashion"], projects: ["Icon Library v2", "Illustration Style Guide", "Marketing Creative Templates"], initials: "LT", gradient: "from-purple-200 to-pink-300", status: "away" },
  { id: 72, name: "Marco Bianchi", role: "Site Reliability Engineer", department: "Engineering", email: "marco@company.com", phone: "+39 320-0172", location: "Milan, Italy", timezone: "CET (UTC+1)", manager: "Frank Chen", joined: "March 8, 2022", birthday: "September 4", pronouns: "he/him", education: "M.Sc Computer Engineering, Politecnico di Milano", bio: "Keeps services running at five nines. Automates toil, builds observability, and owns the on-call playbooks the team actually uses.", skills: ["SRE", "Prometheus", "Grafana", "Go"], certifications: ["Google Cloud Professional DevOps Engineer"], languages: ["Italian", "English"], interests: ["Cycling", "Football", "Espresso", "Formula 1"], projects: ["On-Call Runbook Overhaul", "SLO Framework", "Alerting Consolidation"], initials: "MB", gradient: "from-emerald-200 to-teal-300", status: "busy" },
  { id: 73, name: "Nadia Osei", role: "Talent Acquisition Partner", department: "Human Resources", email: "nadia@company.com", phone: "+233 24-0173", location: "Accra, Ghana", timezone: "GMT (UTC+0)", manager: "Eva Martinez", joined: "May 17, 2023", birthday: "February 22", pronouns: "she/her", education: "B.A. Human Resources, University of Ghana", bio: "Finds and attracts exceptional talent across Africa and Europe. Passionate about inclusive hiring and candidate experience.", skills: ["Technical Recruiting", "LinkedIn Sourcing", "Greenhouse", "DEI"], certifications: ["SHRM-CP"], languages: ["English", "Twi", "French"], interests: ["Afrobeats", "Travel", "Running", "Cooking"], projects: ["Africa Expansion Hiring", "DEI Sourcing Strategy", "Candidate Experience Audit"], initials: "NO", gradient: "from-fuchsia-200 to-purple-300", status: "active" },
  { id: 74, name: "Omar Hassan", role: "Customer Success Manager", department: "Sales", email: "omar@company.com", phone: "+971 55-0174", location: "Dubai, UAE", timezone: "GST (UTC+4)", manager: "Henry Brown", joined: "June 20, 2022", birthday: "March 31", pronouns: "he/him", education: "B.B.A. Business Administration, American University of Sharjah", bio: "Builds lasting relationships with enterprise clients across MENA. Obsessed with onboarding quality and time-to-value.", skills: ["CRM", "Onboarding", "Salesforce", "Communication"], certifications: ["Gainsight Certified", "Salesforce Service Cloud"], languages: ["Arabic", "English"], interests: ["Falconry", "Football", "Travel", "Entrepreneurship"], projects: ["MENA Onboarding Revamp", "Client Health Dashboard", "QBR Programme"], initials: "OH", gradient: "from-teal-200 to-emerald-300", status: "active" },
  { id: 75, name: "Petra Novak", role: "Legal Counsel", department: "Legal", email: "petra@company.com", phone: "+420 7-0175", location: "Prague, Czech Republic", timezone: "CET (UTC+1)", manager: "Priya Sharma", joined: "November 14, 2021", birthday: "July 3", pronouns: "she/her", education: "J.D. Law, Charles University Prague", bio: "Advises on commercial contracts, data protection, and EU regulatory compliance. Keeps the company compliant without slowing the business.", skills: ["Contract Law", "GDPR", "IP", "EU Regulation"], certifications: [], languages: ["Czech", "Slovak", "English", "German"], interests: ["Classical Music", "Hiking", "Literature", "Skiing"], projects: ["EU AI Act Readiness", "Vendor Contract Review", "Data Processing Agreements"], initials: "PN", gradient: "from-indigo-200 to-violet-300", status: "active" },
  { id: 76, name: "Ravi Krishnamurthy", role: "Backend Engineer", department: "Engineering", email: "ravi@company.com", phone: "+91 99-0176", location: "Chennai, India", timezone: "IST (UTC+5:30)", manager: "Frank Chen", joined: "January 22, 2023", birthday: "November 30", pronouns: "he/him", education: "B.Tech Computer Science, NIT Trichy", bio: "Builds resilient high-throughput services in Java and Go. Passionate about system design, clean code, and distributed patterns.", skills: ["Java", "Go", "gRPC", "Event-Driven Architecture"], certifications: ["Oracle Java SE 17 Developer"], languages: ["Tamil", "English", "Hindi"], interests: ["Carnatic Music", "Chess", "Cricket", "Cooking"], projects: ["Payments Service", "Event Bus Migration", "Latency Optimisation"], initials: "RK", gradient: "from-green-200 to-emerald-300", status: "active" },
  { id: 77, name: "Sophie Müller", role: "Finance Analyst", department: "Finance", email: "sophie@company.com", phone: "+49 172-0177", location: "Frankfurt, Germany", timezone: "CET (UTC+1)", manager: "Karen Liu", joined: "August 12, 2022", birthday: "October 20", pronouns: "she/her", education: "B.Sc Finance, Goethe University Frankfurt", bio: "Builds financial models and scenario analyses that drive strategic decisions. Precise, fast, and always with a question for leadership.", skills: ["Financial Modeling", "Excel", "SAP", "PowerPoint"], certifications: ["CFA Level 2"], languages: ["German", "English", "French"], interests: ["Classical Music", "Long-Distance Running", "Cooking", "Travelling"], projects: ["Scenario Planning Model", "Budget Variance Analysis", "Investor Reporting"], initials: "SM", gradient: "from-yellow-200 to-amber-300", status: "active" },
  { id: 78, name: "Tariq Mansouri", role: "DevOps Engineer", department: "Engineering", email: "tariq@company.com", phone: "+974 55-0178", location: "Doha, Qatar", timezone: "AST (UTC+3)", manager: "Frank Chen", joined: "September 22, 2021", birthday: "May 14", pronouns: "he/him", education: "B.Eng Computer Engineering, Qatar University", bio: "Automates everything automatable. Owns CI/CD pipelines, infrastructure-as-code, and the team's deployment reliability.", skills: ["Terraform", "GitLab CI", "Docker", "Ansible"], certifications: ["HashiCorp Terraform Associate", "AWS DevOps Engineer"], languages: ["Arabic", "English"], interests: ["Falconry", "Football", "Travel", "Photography"], projects: ["IaC Migration", "GitLab CI Overhaul", "Container Hardening"], initials: "TM", gradient: "from-sky-200 to-blue-300", status: "active" },
  { id: 79, name: "Ursula Bergmann", role: "HR Business Partner", department: "Human Resources", email: "ursula@company.com", phone: "+41 79-0179", location: "Zurich, Switzerland", timezone: "CET (UTC+1)", manager: "Eva Martinez", joined: "March 1, 2023", birthday: "December 8", pronouns: "she/her", education: "M.A. Business Psychology, University of Zurich", bio: "Partners with Engineering and Product leaders to build high-performing teams and healthy culture. Specialist in leadership coaching.", skills: ["HRBP", "Coaching", "Workforce Planning", "Organisational Design"], certifications: ["ICF Professional Certified Coach", "SHRM-CP"], languages: ["German", "French", "English"], interests: ["Skiing", "Hiking", "Psychology Books", "Cooking"], projects: ["Leadership Coaching Programme", "Headcount Planning", "Team Health Surveys"], initials: "UB", gradient: "from-rose-200 to-orange-300", status: "active" },
  { id: 80, name: "Victor Cruz", role: "Customer Success Lead", department: "Sales", email: "victor@company.com", phone: "+52 55-0180", location: "Mexico City, Mexico", timezone: "CST (UTC−6)", manager: "Omar Hassan", joined: "July 5, 2022", birthday: "August 15", pronouns: "he/him", education: "B.A. Business Administration, ITAM", bio: "Leads a team of CSMs driving retention across LATAM. Brings a strong playbook for onboarding, QBRs, and expansion revenue.", skills: ["CSM Leadership", "EBR", "Expansion Revenue", "Gainsight"], certifications: ["Gainsight Certified"], languages: ["Spanish", "English", "Portuguese"], interests: ["Football", "Salsa Dancing", "Travel", "Entrepreneurship"], projects: ["LATAM Retention Programme", "Churn Reduction Initiative", "QBR Standardisation"], initials: "VC", gradient: "from-lime-200 to-green-300", status: "active" },
  { id: 81, name: "Mei Lin", role: "Support Engineer", department: "Customer Support", email: "mei@company.com", phone: "+65 8-0181", location: "Singapore", timezone: "SGT (UTC+8)", manager: "Tobias Grant", joined: "March 14, 2023", birthday: "September 16", pronouns: "she/her", education: "B.Sc Information Systems, NTU Singapore", bio: "Resolves complex technical issues for enterprise customers. Expert at diagnosing API and integration problems quickly.", skills: ["Technical Support", "API Debugging", "Zendesk", "SQL"], certifications: ["Zendesk Support Certified"], languages: ["English", "Mandarin", "Malay"], interests: ["Pottery", "Running", "Cooking", "Board Games"], projects: ["Support Knowledge Base", "Escalation Triage Process", "Customer Health Alerts"], initials: "ML", gradient: "from-sky-200 to-teal-300", status: "active" },
  { id: 82, name: "Tobias Grant", role: "Support Lead", department: "Customer Support", email: "tobias@company.com", phone: "+44 7900-0182", location: "London, UK", timezone: "GMT (UTC+0)", manager: "Eva Martinez", joined: "November 3, 2021", birthday: "May 19", pronouns: "he/him", education: "B.A. Communications, University of Leeds", bio: "Builds and coaches the global support team. Obsessed with CSAT and time-to-resolution metrics. Turned support into a growth driver.", skills: ["Support Operations", "Zendesk", "CSAT", "Team Management"], certifications: ["ITIL 4 Foundation", "Zendesk Admin Certified"], languages: ["English", "French"], interests: ["Cycling", "Jazz", "Travel", "Coffee"], projects: ["Global Support Playbook", "CSAT Improvement Initiative", "Tier 2 Escalation Redesign"], initials: "TG", gradient: "from-cyan-200 to-emerald-300", status: "active" },
  { id: 83, name: "Amelia Ford", role: "Technical Support Specialist", department: "Customer Support", email: "amelia@company.com", phone: "+1 555-0183", location: "Austin, TX", timezone: "CST (UTC−6)", manager: "Tobias Grant", joined: "January 10, 2024", birthday: "March 4", pronouns: "she/her", education: "B.S. Computer Science, UT Austin", bio: "Front-line hero who handles tricky technical tickets with speed and empathy. Former developer who made the jump to support.", skills: ["Troubleshooting", "APIs", "Python", "Zendesk"], certifications: [], languages: ["English", "Spanish"], interests: ["Rock Climbing", "Gaming", "Open Source", "Podcasts"], projects: ["Self-Service Portal", "Support Automation", "Onboarding Troubleshooting Guide"], initials: "AF", gradient: "from-teal-200 to-sky-300", status: "busy" },
  { id: 84, name: "Rohan Mehta", role: "VP Business Development", department: "Business Development", email: "rohan@company.com", phone: "+91 98-0184", location: "Mumbai, India", timezone: "IST (UTC+5:30)", manager: "Sandra Lee", joined: "August 12, 2020", birthday: "October 3", pronouns: "he/him", education: "MBA, IIM Ahmedabad", bio: "Drives strategic partnerships and new market entry. Closed partnerships with 3 Fortune 100 companies in 2025.", skills: ["Partnerships", "Negotiation", "Market Entry", "GTM Strategy"], certifications: [], languages: ["Hindi", "English", "Gujarati"], interests: ["Cricket", "Travel", "Chess", "Entrepreneurship"], projects: ["APAC Expansion", "Strategic Partnership Programme", "Channel Partner Framework"], initials: "RM", gradient: "from-amber-200 to-yellow-300", status: "active" },
  { id: 85, name: "Claire Dupuis", role: "Partnerships Manager", department: "Business Development", email: "claire@company.com", phone: "+33 6-0185", location: "Paris, France", timezone: "CET (UTC+1)", manager: "Rohan Mehta", joined: "April 6, 2022", birthday: "July 14", pronouns: "she/her", education: "M.Sc International Business, Sciences Po Paris", bio: "Manages technology integrations and co-selling relationships across EMEA. Builds win-win partnerships that last.", skills: ["Partner Management", "GTM", "Salesforce", "Contract Negotiation"], certifications: ["Salesforce Partner Certified"], languages: ["French", "English", "Spanish"], interests: ["Wine", "Architecture", "Running", "Jazz"], projects: ["EMEA Partner Expansion", "Reseller Programme", "Integration Marketplace"], initials: "CD", gradient: "from-yellow-200 to-orange-300", status: "active" },
  { id: 86, name: "James Okoro", role: "Strategic Alliances Lead", department: "Business Development", email: "james@company.com", phone: "+234 80-0186", location: "Lagos, Nigeria", timezone: "WAT (UTC+1)", manager: "Rohan Mehta", joined: "October 18, 2022", birthday: "February 28", pronouns: "he/him", education: "B.Sc Business Administration, University of Lagos", bio: "Leads strategic alliance deals with hyperscalers and ecosystem partners. Deep experience in cloud marketplace listings.", skills: ["Strategic Alliances", "AWS Marketplace", "Deal Structuring", "Negotiation"], certifications: ["AWS Partner Certified"], languages: ["English", "Yoruba"], interests: ["Football", "Afrobeats", "Travel", "Mentoring"], projects: ["AWS Marketplace Listing", "Cloud Alliance Programme", "Partner Summit 2026"], initials: "JO", gradient: "from-orange-200 to-yellow-300", status: "away" },
  { id: 87, name: "Sandra Lee", role: "CEO", department: "Executive", email: "sandra@company.com", phone: "+1 555-0187", location: "San Francisco, CA", timezone: "PST (UTC−8)", manager: "Board of Directors", joined: "January 1, 2018", birthday: "November 12", pronouns: "she/her", education: "MBA, Harvard Business School; B.S. Computer Science, MIT", bio: "Visionary leader who founded the company and grew it from 5 to 500+ people. Passionate about building software that matters.", skills: ["Leadership", "Strategy", "Fundraising", "Product Vision"], certifications: [], languages: ["English", "Mandarin"], interests: ["Sailing", "Reading", "Mentoring Founders", "Marathon Running"], projects: ["2026 Company Strategy", "Series C Fundraising", "Board Programme"], initials: "SL", gradient: "from-violet-300 to-purple-400", status: "active" },
  { id: 88, name: "Marcus Webb", role: "CTO", department: "Executive", email: "marcus.w@company.com", phone: "+1 555-0188", location: "San Francisco, CA", timezone: "PST (UTC−8)", manager: "Sandra Lee", joined: "March 15, 2018", birthday: "April 7", pronouns: "he/him", education: "Ph.D. Computer Science, Stanford University", bio: "Architect of the company's technical vision. Keeps the engineering org moving fast and the platform robust. Open-source advocate.", skills: ["Technical Strategy", "Architecture", "Engineering Culture", "Open Source"], certifications: [], languages: ["English"], interests: ["Open Source", "Rock Climbing", "Science Fiction", "Home Lab"], projects: ["Platform Roadmap 2026", "Engineering Hiring", "Tech Debt Reduction Initiative"], initials: "MW", gradient: "from-indigo-300 to-blue-400", status: "active" },
  { id: 89, name: "Fiona Cheng", role: "CFO", department: "Executive", email: "fiona@company.com", phone: "+1 555-0189", location: "New York, NY", timezone: "EST (UTC−5)", manager: "Sandra Lee", joined: "June 1, 2019", birthday: "August 22", pronouns: "she/her", education: "B.Com Finance, University of Hong Kong; CFA Charterholder", bio: "Manages the company's financial health with rigour and clarity. Led the Series B and Series C financing rounds.", skills: ["Financial Strategy", "Fundraising", "FP&A", "Investor Relations"], certifications: ["CFA Charterholder", "CPA"], languages: ["English", "Cantonese", "Mandarin"], interests: ["Sailing", "Classical Music", "Travel", "Fine Dining"], projects: ["Series C Close", "Financial Systems Upgrade", "Board Reporting Cadence"], initials: "FC", gradient: "from-emerald-300 to-teal-400", status: "active" },
  { id: 90, name: "Meghana Deep", role: "Full Stack Engineer", department: "Engineering", email: "meghanadeep3@gmail.com", phone: "+91 98-0190", location: "Bangalore, India", timezone: "IST (UTC+5:30)", manager: "Marcus Webb", joined: "January 15, 2025", birthday: "October 12", pronouns: "she/her", education: "B.Tech Computer Science, IIT Hyderabad", bio: "Passionate full-stack engineer who loves building elegant products from frontend to backend. Advocate for developer experience and clean code.", skills: ["TypeScript", "React", "Next.js", "Node.js"], certifications: ["AWS Cloud Practitioner", "Google Associate Cloud Engineer"], languages: ["English", "Telugu", "Hindi"], interests: ["Open Source", "Reading", "Badminton", "Travel"], projects: ["Employee Directory", "Internal Dev Tools", "API Modernisation"], initials: "MD", gradient: "from-purple-200 to-fuchsia-300", status: "active" },
];

const PAGE_SIZE = 40;

const allDepts = ["All", ...Array.from(new Set(employees.map((e) => e.department))).sort()];

function deptCount(dept: string) {
  if (dept === "All") return employees.length;
  return employees.filter((e) => e.department === dept).length;
}

const statusConfig: Record<Employee["status"], { dot: string; label: string }> = {
  active: { dot: "bg-emerald-300", label: "Active" },
  away: { dot: "bg-amber-300", label: "Away" },
  busy: { dot: "bg-rose-300", label: "Busy" },
};

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 9v6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function applyOverride(emp: Employee, override: EmployeeOverride | null): Employee {
  if (!override) return emp;
  return {
    ...emp,
    ...(override.bio !== undefined && { bio: override.bio }),
    ...(override.phone !== undefined && { phone: override.phone }),
    ...(override.location !== undefined && { location: override.location }),
    ...(override.timezone !== undefined && { timezone: override.timezone }),
    ...(override.pronouns !== undefined && { pronouns: override.pronouns }),
    ...(override.status !== undefined && { status: override.status }),
    ...(override.skills !== undefined && { skills: override.skills }),
    ...(override.languages !== undefined && { languages: override.languages }),
    ...(override.interests !== undefined && { interests: override.interests }),
  };
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">{label}</p>
        <p className="text-sm text-stone-700 font-medium">{value}</p>
      </div>
    </div>
  );
}

function EmployeeDetailPanel({ emp, onClose, isOwnProfile, onEditClick }: {
  emp: Employee;
  onClose: () => void;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
}) {
  const status = statusConfig[emp.status];
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
        onClick={onClose}
      >
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl shadow-stone-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-[#f5ebe0] to-[#e0c9a6] px-6 pt-12 pb-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-stone-600 hover:bg-black/15 transition cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-3xl overflow-hidden ring-4 ring-white/60 shadow-xl bg-white">
                <img
                  src={`https://i.pravatar.cc/192?u=${encodeURIComponent(emp.email)}`}
                  alt={emp.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${status.dot} shadow-md`} />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 tracking-tight">{emp.name}</h2>
            <p className="text-stone-600 text-sm mt-1 font-medium">{emp.role}</p>
            <p className="text-stone-400 text-xs mt-0.5">{emp.pronouns}</p>
            <div className="mt-3 flex items-center gap-2 rounded-full bg-white/50 px-4 py-1.5">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className="text-xs text-stone-600 font-semibold">{status.label}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">About</p>
            <p className="text-sm text-stone-600 leading-relaxed">{emp.bio}</p>
          </div>

          <div className="h-px bg-stone-100" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Details</p>
            <div className="space-y-3.5">
              <DetailRow icon={<MailIcon />} label="Email" value={emp.email} />
              <DetailRow icon={<PhoneIcon />} label="Phone" value={emp.phone} />
              <DetailRow icon={<LocationIcon className="h-4 w-4" />} label="Location" value={emp.location} />
              <DetailRow icon={<ClockIcon />} label="Timezone" value={emp.timezone} />
              <DetailRow icon={<CalendarIcon />} label="Joined" value={emp.joined} />
              <DetailRow icon={<UserIcon />} label="Manager" value={emp.manager} />
              <DetailRow icon={<GraduationIcon />} label="Education" value={emp.education} />
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Department</p>
            <span className="inline-flex items-center rounded-xl bg-stone-100 px-3.5 py-1.5 text-sm font-semibold text-stone-700">
              {emp.department}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {emp.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Languages</p>
            <div className="flex flex-wrap gap-2">
              {emp.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-lg bg-stone-50 border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-100 bg-white px-6 py-4 flex gap-3">
          {isOwnProfile && (
            <button
              onClick={onEditClick}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-stone-300 bg-stone-100 px-3.5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-200 transition"
              title="Edit your profile"
            >
              <PencilIcon />
              Edit
            </button>
          )}
          <a
            href={`mailto:${emp.email}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8d5b7] to-[#d4b59a] py-3 text-sm font-bold text-stone-800 shadow-md hover:opacity-90 transition"
          >
            <MailIcon />
            Send Email
          </a>
          <a
            href={`tel:${emp.phone}`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition"
          >
            <PhoneIcon />
          </a>
        </div>
      </div>
      </div>
    </>
  );
}

function EditProfilePanel({ emp, onClose, onSave }: {
  emp: Employee;
  onClose: () => void;
  onSave: (override: EmployeeOverride) => void;
}) {
  const [bio, setBio] = useState(emp.bio);
  const [phone, setPhone] = useState(emp.phone);
  const [location, setLocation] = useState(emp.location);
  const [timezone, setTimezone] = useState(emp.timezone);
  const [pronouns, setPronouns] = useState(emp.pronouns);
  const [status, setStatus] = useState<Employee["status"]>(emp.status);
  const [skills, setSkills] = useState(emp.skills.join(", "));
  const [languages, setLanguages] = useState(emp.languages.join(", "));
  const [interests, setInterests] = useState(emp.interests.join(", "));
  const [saving, setSaving] = useState(false);

  const inputCls = "w-full rounded-xl bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2";

  async function handleSave() {
    setSaving(true);
    try {
      const override: EmployeeOverride = {
        email: emp.email,
        bio,
        phone,
        location,
        timezone,
        pronouns,
        status,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
        interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await saveOverride(override);
      onSave(override);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
        onClick={onClose}
      >
        <div
          className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl shadow-stone-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#f5ebe0] to-[#e0c9a6] px-6 pt-8 pb-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-stone-600 hover:bg-black/15 transition cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-white/60 shadow-xl bg-white shrink-0">
                <img
                  src={`https://i.pravatar.cc/192?u=${encodeURIComponent(emp.email)}`}
                  alt={emp.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Editing Profile</p>
                <h2 className="text-xl font-bold text-stone-800">{emp.name}</h2>
                <p className="text-stone-500 text-sm mt-0.5">{emp.role} · {emp.department}</p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Status */}
            <div>
              <p className={labelCls}>Status</p>
              <div className="flex gap-2">
                {(["active", "away", "busy"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border transition ${
                      status === s
                        ? "bg-stone-100 text-stone-800 border-stone-400"
                        : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${statusConfig[s].dot}`} />
                    {statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Bio */}
            <div>
              <label className={labelCls}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell your colleagues about yourself…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="h-px bg-stone-100" />

            {/* Contact / Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Pronouns</label>
                <input type="text" value={pronouns} onChange={(e) => setPronouns(e.target.value)} placeholder="she/her" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Timezone</label>
                <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="PST (UTC-8)" className={inputCls} />
              </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Array fields */}
            <div>
              <label className={labelCls}>Skills</label>
              <p className="text-[11px] text-stone-400 -mt-1 mb-2">Comma-separated</p>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="TypeScript, React, Node.js" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Languages</label>
              <p className="text-[11px] text-stone-400 -mt-1 mb-2">Comma-separated</p>
              <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Spanish" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Interests</label>
              <p className="text-[11px] text-stone-400 -mt-1 mb-2">Comma-separated</p>
              <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Hiking, Photography" className={inputCls} />
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-stone-100 bg-white px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 py-3 text-sm font-bold text-stone-600 hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8d5b7] to-[#d4b59a] py-3 text-sm font-bold text-stone-800 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", total);
  } else if (current >= total - 3) {
    pages.push(1, "…", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "…", current - 1, current, current + 1, "…", total);
  }

  return pages;
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;

  const pages = getPageNumbers(current, total);

  return (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      {/* Prev */}
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35"
        aria-label="Previous page"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-stone-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            aria-current={p === current ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 ${
              p === current
                ? "bg-stone-800 text-stone-50 shadow-md scale-105"
                : "border border-stone-200 bg-white text-stone-600 shadow-sm hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-35"
        aria-label="Next page"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default function EmployeesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [myOverride, setMyOverride] = useState<EmployeeOverride | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      router.replace("/");
    } else {
      setAuthChecked(true);
      const email = sessionStorage.getItem("currentUserEmail") ?? null;
      setLoggedInEmail(email);
      if (email) {
        getOverride(email).then((o) => setMyOverride(o));
      }
    }
  }, [router]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedDept]);

  if (!authChecked) return null;

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.name.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q);
    const matchDept = selectedDept === "All" || e.department === selectedDept;
    return matchSearch && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #fdf6ed 0%, #f0e0c8 55%, #e5c9a0 100%)" }}>
      {/* Sticky top nav */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#e8d5b7] to-[#d4b59a] flex items-center justify-center shadow-md shadow-stone-200">
              <svg className="h-4 w-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4 6v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1m8 0a4 4 0 014-4h1a4 4 0 014 4v1M15 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-stone-800 font-bold text-base tracking-tight">People</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-stone-700">
              <span className="hidden sm:inline">{employees.length} employees</span>
              <span className="hidden sm:inline text-stone-400">·</span>
              <span className="hidden sm:inline">{allDepts.length - 1} departments</span>
            </div>
            <button
              onClick={() => router.push("/appraisals")}
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-100 hover:border-stone-300 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="hidden sm:inline">Appraisals</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("isLoggedIn");
                sessionStorage.removeItem("currentUserEmail");
                router.replace("/");
              }}
              className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-100 hover:border-stone-300 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Employee Directory</h1>
          <p className="text-stone-500 mt-2 text-base">
            {employees.length} people across {allDepts.length - 1} departments — click any card to view details
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, role, department, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 py-3.5 text-stone-800 placeholder-stone-400 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-100 transition text-sm"
          />
        </div>

        {/* Department pill filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allDepts.map((dept) => {
            const count = deptCount(dept);
            const active = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`cursor-pointer flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-stone-800 text-stone-50 border border-stone-700 shadow-sm"
                    : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 shadow-sm"
                }`}
              >
                {dept}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  active ? "bg-stone-600 text-stone-100" : "bg-stone-100 text-stone-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5 min-h-[20px]">
          <p className="text-xs text-stone-400">
            {filtered.length === 0
              ? "No results"
              : `Showing ${from}–${to} of ${filtered.length} employee${filtered.length !== 1 ? "s" : ""}`}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-stone-400">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-stone-200 shadow-sm mb-4 text-stone-400">
              <SearchIcon />
            </div>
            <p className="text-base font-semibold text-stone-600">No employees found</p>
            <p className="text-sm text-stone-400 mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <>
            {/* Employee grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map((emp) => {
                const status = statusConfig[emp.status];
                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    className="cursor-pointer group relative flex flex-col bg-white rounded-3xl overflow-hidden text-left border border-stone-200/50 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-stone-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400/30 focus:ring-offset-2 focus:ring-offset-[#f5f0e8]"
                  >
                    {/* Gradient banner */}
                    <div className="bg-gradient-to-br from-[#f5ebe0] to-[#e0c9a6] h-[68px] w-full shrink-0" />

                    {/* Avatar overlapping banner and body */}
                    <div className="-mt-10 flex justify-center relative z-10 shrink-0">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-white">
                          <img
                            src={`https://i.pravatar.cc/160?u=${encodeURIComponent(emp.email)}`}
                            alt={emp.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${status.dot} shadow-md`}
                          title={status.label}
                        />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-5 pt-3 pb-5 flex flex-col items-center gap-3 flex-1">
                      <div className="text-center">
                        <p className="font-bold text-stone-900 text-sm leading-tight">{emp.name}</p>
                        <p className="text-stone-500 text-xs mt-0.5 font-medium">{emp.role}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600 font-semibold">
                          {emp.department}
                        </span>
                        <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border bg-stone-50 text-stone-600 border-stone-200">
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-stone-400 w-full justify-center">
                        <LocationIcon />
                        <span className="truncate">{emp.location}</span>
                      </div>

                      {emp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {emp.skills.slice(0, 2).map((skill) => (
                            <span key={skill} className="rounded-full bg-stone-50 border border-stone-200 px-2.5 py-0.5 text-[11px] text-stone-500 font-medium">
                              {skill}
                            </span>
                          ))}
                          {emp.skills.length > 2 && (
                            <span className="rounded-full bg-stone-50 border border-stone-200 px-2.5 py-0.5 text-[11px] text-stone-400">
                              +{emp.skills.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Hover ring glow */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent group-hover:ring-stone-400/30 transition-all duration-300 pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <Pagination current={page} total={totalPages} onChange={handlePageChange} />
                <p className="text-xs text-stone-400">
                  {from}–{to} of {filtered.length} employees
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {selected && !editMode && (
        <EmployeeDetailPanel
          emp={selected.email === loggedInEmail ? applyOverride(selected, myOverride) : selected}
          onClose={() => { setSelected(null); setEditMode(false); }}
          isOwnProfile={selected.email === loggedInEmail}
          onEditClick={() => setEditMode(true)}
        />
      )}
      {selected && editMode && (
        <EditProfilePanel
          emp={applyOverride(selected, myOverride)}
          onClose={() => setEditMode(false)}
          onSave={(override) => {
            setMyOverride(override);
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
}
