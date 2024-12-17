import { Itinerary, TravelPreference } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";
import logger from "../utilities/logger";

// Add new interfaces
export interface BudgetAnalysis {
  optimizationSuggestions: string[];
  savingOpportunities: {
    category: string;
    potentialSavings: number;
    strategy: string;
  }[];
  contingencyFund: number;
}

// Add new specialized agents
export class BudgetOptimizationAgent extends BaseAIAgent {
  async process(input: {
    preferences: TravelPreference;
    itinerary: Itinerary;
  }): Promise<BudgetAnalysis> {
    try {
      const budgetPrompt = JSON.stringify({
        budget: input.preferences.budget,
        plannedExpenses: input.itinerary.dailyActivities,
        duration: input.itinerary.totalDays,
      });

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `Analyze budget allocation and provide optimization suggestions:
                  Input: ${budgetPrompt}`,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      logger.error(
        `[BudgetOptimizationAgent] - process() : Budget Optimization Agent process failed: ${error}`
      );
      throw error;
    }
  }
}
