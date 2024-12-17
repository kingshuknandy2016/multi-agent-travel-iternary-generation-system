import OpenAI from "openai";
import dotenv from "dotenv";
import { ItineraryGenerationAgent } from "../agents/ItineraryGenerationAgent";
import { PreferencesValidationAgent } from "../agents/PreferencesValidationAgent";

// Load environment variables
dotenv.config();

// Agent Base Class
abstract class AIAgent {
  protected openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  abstract process(input: any): Promise<any>;
}

// Specialized Agents
// export class PreferencesValidationAgent extends AIAgent {
//   async process(preferences: TravelPreference): Promise<ValidationResult> {
//     const validationPrompt = JSON.stringify({
//       task: "Travel Preferences Validation",
//       instructions: [
//         "Analyze destination feasibility",
//         "Evaluate budget optimization potential",
//         "Check travel period compatibility",
//         "Assess interest alignment",
//       ],
//       outputFormat: `Provide a JSON validation result with these keys:
//           - feasibilityScore: number between 0-100
//           - potentialChallenges: string[]
//           - recommendationFlags: string[]`,
//       input: preferences,
//     });

//     const response = await this.openai.chat.completions.create({
//       model: "gpt-4-turbo",
//       messages: [
//         {
//           role: "user",
//           content: validationPrompt,
//         },
//       ],
//       response_format: { type: "json_object" },
//       max_tokens: 300,
//     });

//     try {
//       return JSON.parse(response.choices[0].message.content || "{}");
//     } catch (error) {
//       console.error("Parsing error:", response.choices[0].message.content);
//       throw error;
//     }
//   }
// }

export class DestinationResearchAgent extends AIAgent {
  async process(preferences: TravelPreference): Promise<DestinationInsights> {
    const researchPrompt = JSON.stringify({
      destination: preferences.destination,
      travelStyle: preferences.travelStyle,
      interests: preferences.interests,
    });

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: `Provide a JSON destination insights with these keys:
          - seasonalConditions: string
          - culturalOpportunities: string[]
          - hiddenGemLocations: string[]
          - riskAssessment: string
          - budgetStrategies: string[]
          - uniqueExperiences: string[]
          
          Input: ${researchPrompt}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }
}

export class RiskMitigationAgent extends AIAgent {
  async process(itinerary: Itinerary): Promise<RiskAssessment> {
    const riskPrompt = JSON.stringify(itinerary);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: `Provide a JSON risk assessment with these keys:
          - riskProbabilities: object with risk type as key, probability as number
          - mitigationStrategies: string[]
          - backupPlans: string[]
          
          Input: ${riskPrompt}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }
}

export class ItineraryOrchestrator {
  private agents: {
    validation: PreferencesValidationAgent;
    research: DestinationResearchAgent;
    generation: ItineraryGenerationAgent;
    riskMitigation: RiskMitigationAgent;
  };

  constructor(apiKey: string) {
    this.agents = {
      validation: new PreferencesValidationAgent(apiKey),
      research: new DestinationResearchAgent(apiKey),
      generation: new ItineraryGenerationAgent(apiKey),
      riskMitigation: new RiskMitigationAgent(apiKey),
    };
  }

  async generateItinerary(
    preferences: TravelPreference
  ): Promise<FinalTravelPlan> {
    try {
      // Stage 1: Preference Validation
      const validationResult = await this.agents.validation.process(
        preferences
      );
      if (validationResult.feasibilityScore < 50) {
        throw new Error("Travel plan not feasible");
      }

      // Stage 2: Destination Research
      const destinationInsights = await this.agents.research.process(
        preferences
      );

      // Stage 3: Itinerary Generation
      const initialItinerary = await this.agents.generation.process({
        preferences,
        destinationInsights,
      });

      // Stage 4: Risk Mitigation
      const riskAssessment = await this.agents.riskMitigation.process(
        initialItinerary
      );

      // Compile Final Travel Plan
      return {
        originalPreferences: preferences,
        validationResult,
        destinationInsights,
        itinerary: initialItinerary,
        riskAssessment,
      };
    } catch (error) {
      console.error("Itinerary Generation Failed:", error);
      throw error;
    }
  }
}

// Type Definitions (Unchanged from previous version)
interface TravelPreference {
  destination: string;
  travelDates: { start: string; end: string };
  travelerCount: number;
  budget: number;
  interests: string[];
  travelStyle: "leisure" | "adventure" | "cultural" | "relaxation";
}

interface ValidationResult {
  feasibilityScore: number;
  potentialChallenges: string[];
  recommendationFlags: string[];
}

interface DestinationInsights {
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

interface RiskAssessment {
  riskProbabilities: { [key: string]: number };
  mitigationStrategies: string[];
  backupPlans: string[];
}

interface FinalTravelPlan {
  originalPreferences: TravelPreference;
  validationResult: ValidationResult;
  destinationInsights: DestinationInsights;
  itinerary: Itinerary;
  riskAssessment: RiskAssessment;
}

// Example Usage
async function main() {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const orchestrator = new ItineraryOrchestrator(apiKey);

  const travelPreferences: TravelPreference = {
    destination: "Japan",
    travelDates: {
      start: "2024-09-15",
      end: "2024-09-25",
    },
    travelerCount: 2,
    budget: 5000,
    interests: ["technology", "cuisine", "historical sites"],
    travelStyle: "cultural",
  };

  try {
    const finalTravelPlan = await orchestrator.generateItinerary(
      travelPreferences
    );
    console.log(
      "Comprehensive Travel Plan:",
      JSON.stringify(finalTravelPlan, null, 2)
    );
  } catch (error) {
    console.error("Travel Plan Generation Failed:", error);
  }
}

main();
