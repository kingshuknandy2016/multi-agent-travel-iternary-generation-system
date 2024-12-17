import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";

export abstract class BaseAIAgent {
  protected openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  abstract process(input: any): Promise<any>;

  // getTokenUsed(
  //   response: ChatCompletion & {
  //     _request_id?: string | null;
  //   }
  // ): any {
  //   return response.usage || null;
  // }
}
