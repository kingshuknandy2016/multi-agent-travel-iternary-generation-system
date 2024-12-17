import { TravelPreference, ValidationResult } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";
import logger from "../utilities/logger";

/**
 * Preferences Validation
    --Preference Validation
    --Validates user travel preferences
    --Checks destination feasibility
    Ensures input data meets basic requirements
 */
export class PreferencesValidationAgent extends BaseAIAgent {
  async process(preferences: TravelPreference): Promise<ValidationResult> {
    try {
      const validationPrompt = `
        Comprehensive Travel Preferences Validation:
        Destination Feasibility Analysis
        Budget Optimization Potential
        Travel Period Compatibility
        Interest Alignment Evaluation
  
        outputFormat: Provide a JSON validation result with these keys:
          - feasibilityScore: number between 0-100,
          - potentialChallenges: string[],
          - recommendationFlags: string[],
  
        Input Details:
        ${JSON.stringify(preferences, null, 2)}
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: validationPrompt }],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const content = response.choices[0].message.content;
      const usage = response.usage;
      logger.info(
        `[PreferencesValidationAgent] - process() : usage of PreferencesValidationAgent: ${JSON.stringify(
          usage,
          null,
          2
        )}`
      );
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        logger.error(
          `[PreferencesValidationAgent] - process() : Failed to parse OpenAI response: ${content}`
        );
        throw new Error("Invalid JSON response from OpenAI");
      }
    } catch (error) {
      logger.error(
        `[PreferencesValidationAgent] - process() : Preferences Validation Agent process failed: ${error}`
      );
      throw error;
    }
  }
}
