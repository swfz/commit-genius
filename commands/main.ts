import { Command, EnumType, ValidationError } from "../deps.ts";
import { getDiffText } from "../lib/get_diff_text.ts";
import { getCommitMessageSuggestion } from "../lib/get_commit_message_suggestion.ts";

export class MainCommand extends Command {
  constructor() {
    super();

    const modelType = new EnumType(["gpt-3.5-turbo", "gpt-4"]);

    this.name("cg")
      .env("OPENAI_ACCESS_TOKEN=<value:string>", "OPENAI ACCESS TOKEN")
      .env("OPENAI_API_KEY=<value:string>", "OPENAI API KEY")
      .type("model-type", modelType)
      .option("-m --model <model:model-type>", "Model Type", {
        default: "gpt-3.5-turbo" as const,
      })
      .action(async (options) => {
        const apiKey = options.openaiAccessToken || options.openaiApiKey;

        if (apiKey === undefined) {
          throw new ValidationError(
            "Any of the environment variables are required",
          );
        }

        const diffText = await getDiffText();
        const commitMessageSuggestion = await getCommitMessageSuggestion(
          apiKey,
          diffText,
          options.model,
        );

        console.log(commitMessageSuggestion);
      });
  }
}
