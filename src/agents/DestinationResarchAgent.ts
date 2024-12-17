import { DestinationInsights, TravelPreference } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";
import logger from "../utilities/logger";

/**
 * Destination Research
    -- Analyze seasonal conditions
    -- Explore cultural opportunities
    -- Identify unique experiences
    -- Evaluate destination risks
 */
export class DestinationResearchAgent extends BaseAIAgent {
  async process(preferences: TravelPreference): Promise<DestinationInsights> {
    try {
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

      const content = response.choices[0].message.content;
      const usage = response.usage;
      logger.info(
        `[DestinationResearchAgent] - process() : usage of PreferencesValidationAgent: ${JSON.stringify(
          usage,
          null,
          2
        )}`
      );
      if (!content) {
        logger.error(
          `[DestinationResearchAgent] - process() : Empty response from OpenAI`
        );
        throw new Error("Empty response from OpenAI");
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        logger.error(
          `[DestinationResearchAgent] - process() : Failed to parse OpenAI response: ${content}`
        );
        throw new Error("Invalid JSON response from OpenAI");
      }
      // return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      logger.error(
        `[DestinationResearchAgent] - process() : Destination Research Agent  process failed: ${error}`
      );
      throw error;
    }
  }
}
