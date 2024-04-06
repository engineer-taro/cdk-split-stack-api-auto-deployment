import { createHash } from "crypto";
import { promises as fs } from "fs";

export const createFilesHash = async (paths: string[]): Promise<string> => {
  try {
    const fileContents = await Promise.all(
      paths.map((path) => fs.readFile(path, "utf8"))
    );
    return createHash("sha256").update(fileContents.join()).digest("hex");
  } catch (error) {
    console.error(`Error reading files: ${error}`);
    throw new Error(`Error reading files: ${error}`);
  }
};
