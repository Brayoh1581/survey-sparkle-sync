export interface Company {
  name: string;
  code: string; // For generating logo badge
  color: string; // HSL color for badge
}

export interface Industry {
  id: string;
  name: string;
  companies: Company[];
}

export const INDUSTRIES: Industry[] = [
  {
    id: "telecommunications",
    name: "Telecommunications",
    companies: [
      { name: "Safaricom PLC", code: "SCM", color: "145 80% 45%" },
      { name: "Airtel Kenya", code: "AK", color: "0 85% 50%" },
      { name: "Telkom Kenya", code: "TK", color: "210 80% 50%" },
      { name: "Jamii Telecommunications (Faiba)", code: "JT", color: "280 70% 55%" },
    ],
  },
  {
    id: "banking",
    name: "Banks & Financial Services",
    companies: [
      { name: "KCB Bank", code: "KCB", color: "145 75% 40%" },
      { name: "Equity Bank", code: "EQ", color: "35 85% 50%" },
      { name: "Cooperative Bank", code: "COOP", color: "210 80% 45%" },
      { name: "Absa Bank Kenya", code: "ABSA", color: "0 85% 50%" },
      { name: "Standard Chartered Kenya", code: "SC", color: "195 70% 45%" },
      { name: "NCBA Bank", code: "NCBA", color: "220 75% 50%" },
      { name: "Stanbic Bank Kenya", code: "SBK", color: "210 80% 50%" },
      { name: "Family Bank", code: "FB", color: "25 80% 55%" },
      { name: "I&M Bank", code: "IM", color: "280 70% 55%" },
      { name: "Sidian Bank", code: "SID", color: "155 70% 45%" },
      { name: "DTB", code: "DTB", color: "195 75% 50%" },
      { name: "HF Group", code: "HF", color: "210 70% 50%" },
    ],
  },
  {
    id: "insurance",
    name: "Insurance Companies",
    companies: [
      { name: "Jubilee Insurance", code: "JUB", color: "0 85% 50%" },
      { name: "Britam", code: "BRT", color: "210 80% 50%" },
      { name: "APA Insurance", code: "APA", color: "145 75% 45%" },
      { name: "CIC Insurance", code: "CIC", color: "25 80% 55%" },
      { name: "ICEA Lion", code: "ICEA", color: "35 85% 50%" },
      { name: "UAP Old Mutual", code: "UAP", color: "195 70% 50%" },
      { name: "Madison Insurance", code: "MAD", color: "280 70% 55%" },
      { name: "Kenya Reinsurance", code: "KR", color: "220 75% 50%" },
    ],
  },
  {
    id: "government",
    name: "Government & Parastatals",
    companies: [
      { name: "Kenya Power (KPLC)", code: "KPLC", color: "210 80% 45%" },
      { name: "KPC", code: "KPC", color: "145 75% 45%" },
      { name: "KPA", code: "KPA", color: "195 70% 50%" },
      { name: "KRA", code: "KRA", color: "0 85% 50%" },
      { name: "Kenya Railways", code: "KR", color: "25 80% 55%" },
      { name: "KAA", code: "KAA", color: "220 75% 50%" },
      { name: "NSSF", code: "NSSF", color: "145 80% 45%" },
      { name: "NHIF", code: "NHIF", color: "155 70% 45%" },
    ],
  },
  {
    id: "retail",
    name: "Retail & Supermarkets",
    companies: [
      { name: "Naivas", code: "NVS", color: "0 85% 50%" },
      { name: "Quickmart", code: "QM", color: "145 75% 45%" },
      { name: "Carrefour Kenya", code: "CRF", color: "210 80% 50%" },
      { name: "Chandarana Foodplus", code: "CFP", color: "25 80% 55%" },
      { name: "Eastmatt", code: "EM", color: "195 70% 50%" },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    companies: [
      { name: "Bidco Africa", code: "BDC", color: "50 80% 50%" },
      { name: "Brookside", code: "BRS", color: "210 75% 50%" },
      { name: "EABL", code: "EABL", color: "145 70% 45%" },
      { name: "Bamburi Cement", code: "BMB", color: "25 75% 50%" },
      { name: "Mombasa Cement", code: "MC", color: "195 70% 50%" },
      { name: "Devki Steel", code: "DVK", color: "0 0% 40%" },
      { name: "Coca-Cola Kenya", code: "CCK", color: "0 80% 50%" },
      { name: "Bata Kenya", code: "BTA", color: "0 85% 50%" },
      { name: "P&G Kenya", code: "PG", color: "210 80% 50%" },
      { name: "Unilever Kenya", code: "UL", color: "195 75% 50%" },
    ],
  },
  {
    id: "energy",
    name: "Energy & Oil",
    companies: [
      { name: "KenGen", code: "KGN", color: "195 75% 50%" },
      { name: "Kenya Power", code: "KP", color: "210 80% 45%" },
      { name: "TotalEnergies Kenya", code: "TOT", color: "0 85% 50%" },
      { name: "Shell/Vivo Energy", code: "SHL", color: "50 85% 50%" },
      { name: "Rubis Energy", code: "RBS", color: "280 70% 55%" },
      { name: "Gulf Energy", code: "GE", color: "25 80% 55%" },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture & Food Processing",
    companies: [
      { name: "KTDA", code: "KTDA", color: "145 75% 40%" },
      { name: "Mumias Sugar", code: "MS", color: "35 80% 55%" },
      { name: "Butali Sugar", code: "BS", color: "25 80% 50%" },
      { name: "Del Monte", code: "DM", color: "0 75% 50%" },
      { name: "Kakuzi", code: "KKZ", color: "145 70% 45%" },
      { name: "Farmers Choice", code: "FC", color: "0 85% 50%" },
      { name: "Kenya Seed Company", code: "KSC", color: "145 80% 45%" },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate & Construction",
    companies: [
      { name: "Centum Real Estate", code: "CRE", color: "210 75% 50%" },
      { name: "Optiven", code: "OPT", color: "155 75% 50%" },
      { name: "Cytonn", code: "CYT", color: "195 70% 50%" },
      { name: "Hass Consult", code: "HC", color: "25 80% 50%" },
      { name: "Suraya", code: "SRY", color: "280 70% 55%" },
      { name: "Kings Developers", code: "KD", color: "35 85% 50%" },
    ],
  },
  {
    id: "transport",
    name: "Transport & Logistics",
    companies: [
      { name: "Kenya Airways (KQ)", code: "KQ", color: "210 85% 45%" },
      { name: "SGR/Kenya Railways", code: "SGR", color: "0 75% 50%" },
      { name: "Modern Coast", code: "MC", color: "195 70% 50%" },
      { name: "Easy Coach", code: "EC", color: "25 80% 55%" },
      { name: "DHL Kenya", code: "DHL", color: "50 85% 50%" },
      { name: "G4S Kenya", code: "G4S", color: "0 0% 25%" },
    ],
  },
  {
    id: "technology",
    name: "Technology & Startups",
    companies: [
      { name: "M-Pesa", code: "MP", color: "145 80% 45%" },
      { name: "Twiga Foods", code: "TWG", color: "25 80% 55%" },
      { name: "Wasoko", code: "WSK", color: "210 80% 50%" },
      { name: "Sendy", code: "SNY", color: "280 70% 55%" },
      { name: "Little Cab", code: "LC", color: "195 70% 50%" },
      { name: "Jumia", code: "JMA", color: "25 85% 55%" },
      { name: "Copia", code: "CPA", color: "0 85% 50%" },
    ],
  },
  {
    id: "media",
    name: "Media Companies",
    companies: [
      { name: "Nation Media Group", code: "NMG", color: "210 80% 50%" },
      { name: "Standard Group", code: "STD", color: "0 85% 50%" },
      { name: "Royal Media Services", code: "RMS", color: "25 80% 55%" },
      { name: "Radio Africa Group", code: "RAG", color: "280 70% 55%" },
      { name: "KBC", code: "KBC", color: "145 75% 45%" },
    ],
  },
];

// Survey question templates for generating dynamic surveys
export const SURVEY_QUESTION_TEMPLATES = [
  {
    type: "multiple_choice",
    templates: [
      "How satisfied are you with {company}'s services?",
      "How often do you use {company}'s products/services?",
      "Would you recommend {company} to others?",
      "How would you rate {company}'s customer service?",
      "How likely are you to continue using {company}?",
      "How does {company} compare to competitors?",
      "What is your overall impression of {company}?",
      "How would you rate the value for money at {company}?",
    ],
    options: [
      ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
      ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      ["Definitely Yes", "Probably Yes", "Not Sure", "Probably No", "Definitely No"],
      ["Excellent", "Good", "Average", "Poor", "Very Poor"],
      ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"],
      ["Much Better", "Somewhat Better", "About the Same", "Somewhat Worse", "Much Worse"],
      ["Excellent", "Good", "Average", "Poor", "Very Poor"],
      ["Excellent Value", "Good Value", "Fair Value", "Poor Value", "Very Poor Value"],
    ]
  }
];

export const SURVEY_TITLES = [
  "{company} Customer Experience Survey",
  "{company} Service Quality Assessment",
  "{company} Product Feedback Survey",
  "{company} Brand Perception Study",
  "{company} Customer Satisfaction Survey",
  "{company} Market Research Survey",
  "{company} User Experience Survey",
  "{company} Service Improvement Survey",
];

export const SURVEY_DESCRIPTIONS = [
  "Share your experience with {company} and help improve their services.",
  "Help {company} understand customer needs better.",
  "Your feedback will help {company} serve you better.",
  "Participate in this quick survey about {company}.",
  "Tell us what you think about {company}'s offerings.",
];
