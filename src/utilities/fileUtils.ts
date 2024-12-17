import fs from "fs/promises";
import path from "path";
import logger from "./logger";

/**
 * Writes JSON content to a file with proper formatting
 * @param content - The content to write (will be converted to JSON)
 * @param fileName - Name of the file (with or without .json extension)
 * @param directory - Optional directory path (defaults to './output')
 */
export async function writeJsonToFile(
  content: unknown,
  fileName: string,
  directory: string = "./output"
): Promise<void> {
  try {
    // Ensure fileName has .json extension
    const fullFileName = fileName.endsWith(".json")
      ? fileName
      : `${fileName}.json`;

    // Create directory if it doesn't exist
    await fs.mkdir(directory, { recursive: true });

    // Create full file path
    const filePath = path.join(directory, fullFileName);

    // Convert content to formatted JSON string
    const jsonContent = JSON.stringify(content, null, 2);

    // Write to file
    await fs.writeFile(filePath, jsonContent, "utf8");

    logger.info(`[FileUtils] - Successfully wrote JSON to ${filePath}`);
  } catch (error) {
    logger.error(`[FileUtils] - Failed to write JSON file: ${error}`);
    throw error;
  }
}
