import { CollaborationResult, TravelPreference } from "../interface";
import { BaseAIAgent } from "../interface/BaseAIAgent";
import logger from "../utilities/logger";

// Dynamic Agent Collaboration Framework
export class AgentCollaborationFramework {
  private agents: Map<string, BaseAIAgent> = new Map();
  private communicationProtocol = {
    informationSharing: {
      validationToResearch: ["feasibilityScore", "recommendationFlags"],
      researchToGeneration: ["culturalInsights", "uniqueExperiences"],
      generationToRiskMitigation: ["logisticalDetails", "activityRisks"],
    },
    escalationThresholds: {
      validationFailure: 50,
      riskTolerance: 0.3,
    },
  };

  registerAgent(name: string, agent: any) {
    this.agents.set(name, agent);
  }

  /**
   * Collaborative Process
     - Agent Collaboration Mechanism
     - The multi-agent system introduces a sophisticated collaboration model where each agent has a specialized role:
   */
  async collaborativeProcess(
    initialInput: TravelPreference
  ): Promise<CollaborationResult> {
    const collaborationStages = [
      "validation",
      "research",
      "generation",
      "riskMitigation",
    ];

    let sharedContext: any = initialInput;
    const stageResults: any[] = [];

    for (const stageName of collaborationStages) {
      const agent = this.agents.get(stageName);
      if (!agent) continue;

      try {
        logger.info(
          `[AgentCollaborationFramework] - collaborativeProcess() : Processing ${stageName} stage.=================`
        );
        const stageResult = await agent.process(sharedContext);
        logger.info(
          `[AgentCollaborationFramework] - collaborativeProcess() : Stage Result: ${JSON.stringify(
            stageResult,
            null,
            2
          )}`
        );
        stageResults.push(stageResult);

        // Update shared context for next stage
        sharedContext = {
          ...sharedContext,
          [`${stageName}Result`]: stageResult,
        };

        // Check escalation conditions
        this.checkEscalationConditions(stageName, stageResult);
      } catch (error) {
        console.error(`Collaboration failed at ${stageName} stage`, error);
        throw error;
      }
    }

    return {
      finalOutput: sharedContext,
      stageResults: stageResults,
    };
  }

  private checkEscalationConditions(stageName: string, stageResult: any): void {
    // Implement stage-specific escalation logic
    switch (stageName) {
      case "validation":
        if (
          stageResult.feasibilityScore <
          this.communicationProtocol.escalationThresholds.validationFailure
        ) {
          throw new Error("Travel plan not feasible");
        }
        break;
      case "riskMitigation":
        // Example risk assessment
        const overallRisk =
          Object.values(
            stageResult.riskProbabilities as Record<string, number>
          ).reduce((a, b) => a + b, 0) /
          Object.keys(stageResult.riskProbabilities).length;

        if (
          overallRisk >
          this.communicationProtocol.escalationThresholds.riskTolerance
        ) {
          console.warn("High-risk travel scenario detected");
        }
        break;
    }
  }
}
