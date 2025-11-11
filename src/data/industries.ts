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
    id: "education",
    name: "Education",
    companies: [
      { name: "Bridge Academies", code: "BA", color: "210 80% 50%" },
      { name: "Strathmore University", code: "SU", color: "0 70% 50%" },
      { name: "University of Nairobi", code: "UoN", color: "145 70% 45%" },
      { name: "Kenyatta University", code: "KU", color: "25 85% 55%" },
      { name: "USIU-Africa", code: "UA", color: "265 70% 55%" },
      { name: "Nova Pioneer", code: "NP", color: "180 65% 50%" },
    ],
  },
  {
    id: "health",
    name: "Health & Medicine",
    companies: [
      { name: "Dawa Life Sciences", code: "DLS", color: "340 75% 50%" },
      { name: "Aga Khan Hospital", code: "AKH", color: "195 75% 45%" },
      { name: "Nairobi Hospital", code: "NH", color: "155 70% 45%" },
      { name: "Gertrude's Children's Hospital", code: "GCH", color: "280 70% 55%" },
      { name: "Kenyatta National Hospital", code: "KNH", color: "15 80% 50%" },
      { name: "MP Shah Hospital", code: "MPS", color: "220 75% 50%" },
    ],
  },
  {
    id: "transport",
    name: "Transport",
    companies: [
      { name: "Kenya Airways", code: "KQ", color: "210 85% 45%" },
      { name: "BasiGo", code: "BG", color: "145 75% 45%" },
      { name: "Easy Coach", code: "EC", color: "25 80% 55%" },
      { name: "Modern Coast", code: "MC", color: "195 70% 50%" },
      { name: "SGR (Madaraka Express)", code: "SGR", color: "0 75% 50%" },
      { name: "Uber Kenya", code: "UK", color: "0 0% 15%" },
      { name: "Bolt Kenya", code: "BK", color: "145 80% 45%" },
    ],
  },
  {
    id: "ict",
    name: "ICT & Technology Services",
    companies: [
      { name: "Safaricom", code: "SCM", color: "145 80% 45%" },
      { name: "Airtel Kenya", code: "AK", color: "0 85% 50%" },
      { name: "Telkom Kenya", code: "TK", color: "210 80% 50%" },
      { name: "Wananchi Group", code: "WG", color: "25 75% 50%" },
      { name: "Jumia Kenya", code: "JK", color: "25 85% 55%" },
      { name: "M-PESA", code: "MP", color: "145 75% 45%" },
    ],
  },
  {
    id: "tourism",
    name: "Tourism & Hospitality",
    companies: [
      { name: "Serena Hotels", code: "SH", color: "35 75% 50%" },
      { name: "Sarova Hotels", code: "SAR", color: "195 70% 50%" },
      { name: "Tribe Hotel", code: "TH", color: "280 70% 55%" },
      { name: "Kenya Safari Lodges", code: "KSL", color: "145 70% 45%" },
      { name: "PrideInn Hotels", code: "PI", color: "340 75% 50%" },
      { name: "Bonfire Adventures", code: "BA", color: "25 85% 55%" },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    companies: [
      { name: "Kakuzi", code: "KZ", color: "145 75% 45%" },
      { name: "Twiga Foods", code: "TF", color: "25 80% 55%" },
      { name: "Sasini", code: "SAS", color: "145 70% 50%" },
      { name: "Williamson Tea", code: "WT", color: "155 65% 45%" },
      { name: "Del Monte Kenya", code: "DMK", color: "0 75% 50%" },
      { name: "Brookside Dairy", code: "BD", color: "210 75% 50%" },
    ],
  },
  {
    id: "mining",
    name: "Mining",
    companies: [
      { name: "Base Titanium", code: "BT", color: "220 70% 50%" },
      { name: "Bamburi Cement", code: "BC", color: "25 75% 50%" },
      { name: "East African Portland Cement", code: "EAPC", color: "0 0% 40%" },
      { name: "ARM Cement", code: "ARM", color: "210 65% 50%" },
    ],
  },
  {
    id: "business",
    name: "Business & Professional Services",
    companies: [
      { name: "KPMG Kenya", code: "KPMG", color: "210 80% 45%" },
      { name: "Deloitte Kenya", code: "DLT", color: "145 75% 45%" },
      { name: "PwC Kenya", code: "PwC", color: "25 80% 50%" },
      { name: "EY Kenya", code: "EY", color: "50 85% 50%" },
      { name: "Grant Thornton", code: "GT", color: "280 70% 55%" },
      { name: "BDO Kenya", code: "BDO", color: "210 75% 50%" },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    companies: [
      { name: "Bidco Africa", code: "BA", color: "50 80% 50%" },
      { name: "East African Breweries (EABL)", code: "EABL", color: "145 70% 45%" },
      { name: "Sameer Group", code: "SG", color: "210 75% 50%" },
      { name: "Kenya Breweries", code: "KB", color: "35 75% 50%" },
      { name: "Coca-Cola Kenya", code: "CCK", color: "0 80% 50%" },
      { name: "Unilever Kenya", code: "UL", color: "195 70% 50%" },
    ],
  },
  {
    id: "housing",
    name: "Housing & Real Estate",
    companies: [
      { name: "Centum Real Estate", code: "CRE", color: "210 75% 50%" },
      { name: "Cytonn Investments", code: "CI", color: "195 70% 50%" },
      { name: "HassConsult", code: "HC", color: "25 80% 50%" },
      { name: "Suraya Property Group", code: "SPG", color: "280 70% 55%" },
      { name: "Erdemann Properties", code: "EP", color: "145 70% 45%" },
      { name: "Optiven Group", code: "OG", color: "155 75% 50%" },
    ],
  },
  {
    id: "water",
    name: "Water & Sewerage",
    companies: [
      { name: "Nairobi Water", code: "NW", color: "195 75% 50%" },
      { name: "Athi Water", code: "AW", color: "210 70% 50%" },
      { name: "Enpure", code: "EN", color: "155 70% 45%" },
      { name: "Kenya Water Towers Agency", code: "KWTA", color: "145 75% 45%" },
      { name: "Mombasa Water Supply", code: "MWS", color: "195 70% 50%" },
    ],
  },
];
