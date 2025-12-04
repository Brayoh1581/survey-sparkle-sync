import { INDUSTRIES, SURVEY_QUESTION_TEMPLATES, SURVEY_TITLES, SURVEY_DESCRIPTIONS } from "@/data/industries";

export interface GeneratedQuestion {
  question: string;
  type: "multiple_choice" | "text";
  options?: string[];
}

export interface GeneratedSurvey {
  id: string;
  title: string;
  description: string;
  payout: number;
  company: string;
  industry: string;
  questions: GeneratedQuestion[];
  isGenerated: boolean;
}

// Generate a random payout between 32 and 74
const generatePayout = (): number => {
  return Math.floor(Math.random() * (74 - 32 + 1)) + 32;
};

// Generate a unique ID
const generateId = (): string => {
  return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate questions for a survey
const generateQuestions = (companyName: string, count: number = 7): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];
  const templates = SURVEY_QUESTION_TEMPLATES[0];
  const usedIndices = new Set<number>();

  // Generate multiple choice questions
  while (questions.length < count - 1 && usedIndices.size < templates.templates.length) {
    const index = Math.floor(Math.random() * templates.templates.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      questions.push({
        question: templates.templates[index].replace("{company}", companyName),
        type: "multiple_choice",
        options: templates.options[index],
      });
    }
  }

  // Add one text question at the end
  questions.push({
    question: `What suggestions do you have for ${companyName} to improve their services?`,
    type: "text",
  });

  return shuffleArray(questions);
};

// Generate surveys for a specific company
export const generateSurveysForCompany = (
  companyName: string,
  industryId: string,
  count: number = 5
): GeneratedSurvey[] => {
  const surveys: GeneratedSurvey[] = [];
  const usedTitleIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let titleIndex = Math.floor(Math.random() * SURVEY_TITLES.length);
    while (usedTitleIndices.has(titleIndex) && usedTitleIndices.size < SURVEY_TITLES.length) {
      titleIndex = Math.floor(Math.random() * SURVEY_TITLES.length);
    }
    usedTitleIndices.add(titleIndex);

    surveys.push({
      id: generateId(),
      title: SURVEY_TITLES[titleIndex].replace("{company}", companyName),
      description: getRandomItem(SURVEY_DESCRIPTIONS).replace("{company}", companyName),
      payout: generatePayout(),
      company: companyName,
      industry: industryId,
      questions: generateQuestions(companyName, Math.floor(Math.random() * 4) + 5), // 5-8 questions
      isGenerated: true,
    });
  }

  return surveys;
};

// Generate surveys for an entire industry
export const generateSurveysForIndustry = (industryId: string): GeneratedSurvey[] => {
  const industry = INDUSTRIES.find((ind) => ind.id === industryId);
  if (!industry) return [];

  const allSurveys: GeneratedSurvey[] = [];

  industry.companies.forEach((company) => {
    const surveysPerCompany = Math.floor(Math.random() * 5) + 4; // 4-8 surveys per company
    const companySurveys = generateSurveysForCompany(company.name, industryId, surveysPerCompany);
    allSurveys.push(...companySurveys);
  });

  return shuffleArray(allSurveys);
};

// Generate fallback surveys from any industry
export const generateFallbackSurveys = (count: number = 5): GeneratedSurvey[] => {
  const surveys: GeneratedSurvey[] = [];
  const shuffledIndustries = shuffleArray([...INDUSTRIES]);

  for (let i = 0; i < count && i < shuffledIndustries.length; i++) {
    const industry = shuffledIndustries[i];
    const company = getRandomItem(industry.companies);
    const companySurveys = generateSurveysForCompany(company.name, industry.id, 1);
    surveys.push(...companySurveys);
  }

  return surveys;
};

// Merge database surveys with generated surveys
export const ensureSurveysAvailable = (
  dbSurveys: any[],
  industryId: string
): GeneratedSurvey[] => {
  const industry = INDUSTRIES.find((ind) => ind.id === industryId);
  if (!industry) return generateFallbackSurveys();

  const companySurveyMap = new Map<string, GeneratedSurvey[]>();

  // Initialize with empty arrays for each company
  industry.companies.forEach((company) => {
    companySurveyMap.set(company.name, []);
  });

  // Add database surveys
  dbSurveys.forEach((survey) => {
    if (survey.company && companySurveyMap.has(survey.company)) {
      companySurveyMap.get(survey.company)!.push({
        ...survey,
        isGenerated: false,
      });
    }
  });

  // Generate surveys for companies that don't have enough
  industry.companies.forEach((company) => {
    const existingSurveys = companySurveyMap.get(company.name) || [];
    const minSurveysPerCompany = 4;

    if (existingSurveys.length < minSurveysPerCompany) {
      const needed = minSurveysPerCompany - existingSurveys.length;
      const generatedSurveys = generateSurveysForCompany(company.name, industryId, needed);
      companySurveyMap.set(company.name, [...existingSurveys, ...generatedSurveys]);
    }
  });

  // Flatten and shuffle all surveys
  const allSurveys: GeneratedSurvey[] = [];
  companySurveyMap.forEach((surveys) => {
    allSurveys.push(...surveys);
  });

  return allSurveys;
};
