import {
  BudgetOptimizationAgent,
  DestinationResearchAgent,
  ItineraryGenerationAgent,
  LocalExperienceAgent,
  PreferencesValidationAgent,
} from "./agents";
import {
  FinalTravelPlan,
  TravelExperience,
  TravelPreference,
} from "./interface";
import {
  AgentCollaborationFramework,
  ContextualLearningModule,
} from "./modules";
import dotenv from "dotenv";

import { writeJsonToFile } from "./utilities/fileUtils";
import { logger } from "./utilities/loggerV2";
import { RiskMitigationAgent } from "./generic/MultiAgentTravelItineraryGenarationSystem";
// Load environment variables
dotenv.config();
async function main() {
  const apiKey = process.env.OPENAI_API_KEY || "";

  // Contextual Learning Setup
  const learningModule = new ContextualLearningModule();

  // Agent Collaboration Framework
  const collaborationFramework = new AgentCollaborationFramework();

  // Simulated agents would be added here
  await collaborationFramework.registerAgent(
    "validation",
    new PreferencesValidationAgent(apiKey)
  );
  await collaborationFramework.registerAgent(
    "research",
    new DestinationResearchAgent(apiKey)
  );
  collaborationFramework.registerAgent(
    "generation",
    new ItineraryGenerationAgent(apiKey)
  );
  collaborationFramework.registerAgent(
    "riskMitigation",
    new RiskMitigationAgent(apiKey)
  );
  collaborationFramework.registerAgent(
    "budgetOptimization",
    new BudgetOptimizationAgent(apiKey)
  );
  collaborationFramework.registerAgent(
    "localExperience",
    new LocalExperienceAgent(apiKey)
  );
  // collaborationFramework.registerAgent('validation', validationAgent);
  // ... other agents

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
    // Collaborative Agent Processing
    const collaborationResult =
      await collaborationFramework.collaborativeProcess(travelPreferences);

    // Write collaboration result to file
    await writeJsonToFile(
      collaborationResult,
      "collaboration-result",
      "./output/travel-plans"
    );
    logger.info(
      `[Main] - main() : collaborationResult:${JSON.stringify(
        collaborationResult,
        null,
        2
      )}`
    );

    // Check structure of collaborationResult.finalOutput
    const travelPlan = {
      ...collaborationResult.finalOutput, // Ensure this contains `originalPreferences`
      originalPreferences: travelPreferences,
    } as FinalTravelPlan;

    logger.info(
      `[Main] - main() : Travel Plan: ${JSON.stringify(travelPlan, null, 2)}`
    );

    // Simulated Travel Experience (would normally come from user feedback)
    const travelExperience: TravelExperience = {
      actualDestination: "Japan",
      completedActivities: ["Tokyo Tech Museum", "Sushi Cooking Class"],
      actualSpending: 4800,
      satisfactionLevel: 4.5,
    };

    // Record Travel Outcome for Learning
    const learningSignal = learningModule.recordTravelOutcome(
      travelPlan,
      travelExperience
    );

    logger.info(
      `[Main] - main() : Learning Signal: ${JSON.stringify(
        learningSignal,
        null,
        2
      )}`
    );
    // Generate Improved Recommendations
    const improvedRecommendations =
      learningModule.generateImprovedRecommendations(travelPreferences);

    logger.info(
      `[Main] - main() : Collaboration Results: ${JSON.stringify(
        improvedRecommendations,
        null,
        2
      )}`
    );

    // Write improved recommendations to file
    await writeJsonToFile(
      improvedRecommendations,
      "improved-recommendations",
      "./output/travel-plans"
    );
  } catch (error) {
    logger.error(`[Main] - main() : Travel Planning Failed: ${error}`);
  }
}

main();
