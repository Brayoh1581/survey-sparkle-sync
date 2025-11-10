export interface Company {
  name: string;
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
      { name: "Bridge Academies" },
      { name: "Strathmore University" },
      { name: "University of Nairobi" },
      { name: "Kenyatta University" },
      { name: "USIU-Africa" },
      { name: "Nova Pioneer" },
    ],
  },
  {
    id: "health",
    name: "Health & Medicine",
    companies: [
      { name: "Dawa Life Sciences" },
      { name: "Aga Khan Hospital" },
      { name: "Nairobi Hospital" },
      { name: "Gertrude's Children's Hospital" },
      { name: "Kenyatta National Hospital" },
      { name: "MP Shah Hospital" },
    ],
  },
  {
    id: "transport",
    name: "Transport",
    companies: [
      { name: "Kenya Airways" },
      { name: "BasiGo" },
      { name: "Easy Coach" },
      { name: "Modern Coast" },
      { name: "SGR (Madaraka Express)" },
      { name: "Uber Kenya" },
      { name: "Bolt Kenya" },
    ],
  },
  {
    id: "ict",
    name: "ICT & Technology Services",
    companies: [
      { name: "Safaricom" },
      { name: "Airtel Kenya" },
      { name: "Telkom Kenya" },
      { name: "Wananchi Group" },
      { name: "Jumia Kenya" },
      { name: "M-PESA" },
    ],
  },
  {
    id: "tourism",
    name: "Tourism & Hospitality",
    companies: [
      { name: "Serena Hotels" },
      { name: "Sarova Hotels" },
      { name: "Tribe Hotel" },
      { name: "Kenya Safari Lodges" },
      { name: "PrideInn Hotels" },
      { name: "Bonfire Adventures" },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    companies: [
      { name: "Kakuzi" },
      { name: "Twiga Foods" },
      { name: "Sasini" },
      { name: "Williamson Tea" },
      { name: "Del Monte Kenya" },
      { name: "Brookside Dairy" },
    ],
  },
  {
    id: "mining",
    name: "Mining",
    companies: [
      { name: "Base Titanium" },
      { name: "Bamburi Cement" },
      { name: "East African Portland Cement" },
      { name: "ARM Cement" },
    ],
  },
  {
    id: "business",
    name: "Business & Professional Services",
    companies: [
      { name: "KPMG Kenya" },
      { name: "Deloitte Kenya" },
      { name: "PwC Kenya" },
      { name: "EY Kenya" },
      { name: "Grant Thornton" },
      { name: "BDO Kenya" },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    companies: [
      { name: "Bidco Africa" },
      { name: "East African Breweries (EABL)" },
      { name: "Sameer Group" },
      { name: "Kenya Breweries" },
      { name: "Coca-Cola Kenya" },
      { name: "Unilever Kenya" },
    ],
  },
  {
    id: "housing",
    name: "Housing & Real Estate",
    companies: [
      { name: "Centum Real Estate" },
      { name: "Cytonn Investments" },
      { name: "HassConsult" },
      { name: "Suraya Property Group" },
      { name: "Erdemann Properties" },
      { name: "Optiven Group" },
    ],
  },
  {
    id: "water",
    name: "Water & Sewerage",
    companies: [
      { name: "Nairobi Water" },
      { name: "Athi Water" },
      { name: "Enpure" },
      { name: "Kenya Water Towers Agency" },
      { name: "Mombasa Water Supply" },
    ],
  },
];
