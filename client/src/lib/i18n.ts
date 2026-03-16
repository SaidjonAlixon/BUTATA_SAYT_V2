import { create } from 'zustand';

// English-only translations
export const translations = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    ownerOperators: "Owner Operators",
    companyDrivers: "Company Drivers",
    contact: "Contact",
    applyNow: "Apply Now",
  },
  hero: {
    title: "Moving Your Business Forward, Mile by Mile",
    subtitle: "Reliable logistics solutions tailored for the modern world. Join the fastest growing fleet in the region.",
    cta: "Get Started",
    learnMore: "Learn More",
  },
  stats: {
    miles: "Miles Driven",
    drivers: "Professional Drivers",
    years: "Years of Excellence",
  },
  features: {
    title: "Why Choose Us",
    reliability: {
      title: "Reliable Service",
      description: "On-time delivery guaranteed with our state-of-the-art fleet",
    },
    safety: {
      title: "Safety First",
      description: "Industry-leading safety standards and training programs",
    },
    support: {
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your logistics needs",
    },
  },
  about: {
    title: "About Us",
    subtitle: "Your Trusted Logistics Partner",
    description: "With years of experience in the trucking industry, we provide reliable and efficient transportation solutions.",
  },
  contact: {
    title: "Get in Touch",
    subtitle: "We'd love to hear from you",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send Message",
    success: "Message sent successfully!",
    error: "Failed to send message. Please try again.",
  },
  apply: {
    title: "Apply Now",
    subtitle: "Join Our Team",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    position: "Position",
    experience: "Years of Experience",
    cdl: "CDL Number",
    cleanRecord: "I have a clean driving record",
    resume: "Upload Resume",
    submit: "Submit Application",
    success: "Application submitted successfully!",
    error: "Failed to submit application. Please try again.",
  },
  footer: {
    company: "Company",
    quickLinks: "Quick Links",
    contact: "Contact",
    followUs: "Follow Us",
    rights: "All rights reserved.",
  },
};

export type Translation = typeof translations;

interface LanguageState {
  t: Translation;
}

export const useLanguage = create<LanguageState>(() => ({
  t: translations,
}));
