// Interfaces for type safety
export interface TravelPreference {
  destination: string;
  travelDates: {
    start: string;
    end: string;
  };
  travelerCount: number;
  budget: number;
  interests: string[];
  travelStyle: "leisure" | "adventure" | "cultural" | "relaxation";
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: string[];
  meals: string[];
  transportation: string;
}

// interface TravelPreference {
//     destination: string;
//     travelDates: { start: string; end: string };
//     travelerCount: number;
//     budget: number;
//     interests: string[];
//     travelStyle: "leisure" | "adventure" | "cultural" | "relaxation";
//   }

export interface ValidationResult {
  feasibilityScore: number;
  potentialChallenges: string[];
  recommendationFlags: string[];
}

export interface DestinationInsights {
  seasonalConditions: string;
  culturalOpportunities: string[];
  hiddenGemLocations: string[];
  riskAssessment: string;
  budgetStrategies: string[];
  uniqueExperiences: string[];
}

export interface Itinerary {
  destination: string;
  totalDays: number;
  dailyActivities: Array<{
    day: number;
    activities: string[];
    estimatedCost: number;
  }>;
}

export interface RiskAssessment {
  riskProbabilities: { [key: string]: number };
  mitigationStrategies: string[];
  backupPlans: string[];
}

export interface FinalTravelPlan {
  originalPreferences: TravelPreference;
  validationResult: ValidationResult;
  destinationInsights: DestinationInsights;
  itinerary: Itinerary;
  riskAssessment: RiskAssessment;
}

// Type Definitions (Expanded)
export interface LearningSignal {
  accuracyMetrics: {
    destinationRelevance: number;
    activityAlignment: number;
    budgetEfficiency: number;
  };
  divergencePoints: string[];
}

export interface TravelExperience {
  actualDestination: string;
  completedActivities: string[];
  actualSpending: number;
  satisfactionLevel: number;
}

export interface ImprovedRecommendation {
  recommendedAdjustments: RecommendationAdjustment[];
  confidenceScore: number;
}

export interface RecommendationAdjustment {
  type: string;
  suggestion: string;
  confidenceLevel: number;
}

export interface CollaborationResult {
  finalOutput: any;
  stageResults: any[];
}
