import { DestinationInsights, Itinerary, TravelPreference } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";
import logger from "../utilities/logger";

export class ItineraryGenerationAgent extends BaseAIAgent {
  async process(params: any): Promise<Itinerary> {
    try {
      //const { preferences, destinationInsights } = params;
      // Extract preferences and insights from the shared context
      const preferences = params.preferences || params;
      const destinationInsights =
        params.researchResult || params.destinationInsights;

      const generationPrompt = JSON.stringify({
        destination: preferences.destination,
        travelDates: preferences.travelDates,
        budget: preferences.budget,
        interests: preferences.interests,
        destinationInsights: destinationInsights,
      });

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a travel itinerary planning assistant. Always respond with a valid JSON object containing the requested itinerary structure.",
          },
          {
            role: "user",
            content: `Provide a JSON itinerary with these keys:
              - destination: string
              - totalDays: number
              - dailyActivities: array of {
                day: number,
                activities: string[],
                estimatedCost: number
              }
              
              Input: ${generationPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      const usage = response.usage;
      logger.info(
        `[ItineraryGenerationAgent] - process() : Usage of PreferencesValidationAgent: ${usage?.total_tokens}`
      );
      if (!content) {
        logger.error(
          `[ItineraryGenerationAgent] - process() : Empty response from OpenAI`
        );
        throw new Error("Empty response from OpenAI");
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        logger.error(
          `[ItineraryGenerationAgent] - process() : Failed to parse OpenAI response: ${content}`
        );
        throw new Error("Invalid JSON response from OpenAI");
      }
      //return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      logger.error(
        `[ItineraryGenerationAgent] - process() : Itinerary Generation Agent process failed: ${error}`
      );
      throw error;
    }
  }
}
