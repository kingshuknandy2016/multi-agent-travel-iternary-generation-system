import { Itinerary } from "../generic/MultiAgentTravelItineraryGenarationSystem";
import { TravelPreference } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";

export interface LocalInsights {
  authenticExperiences: string[];
  localCustoms: string[];
  hiddenGems: string[];
  culturalNotes: string[];
}
export class LocalExperienceAgent extends BaseAIAgent {
  async process(input: {
    destination: string;
    interests: string[];
  }): Promise<LocalInsights> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: `Provide authentic local experiences and cultural insights for ${
            input.destination
          } 
          matching interests: ${input.interests.join(", ")}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }
}
