// processedTitlesManager.ts
import * as fs from "fs/promises";
import path from "path";

const processedTitlesFile = path.join(__dirname, "processedTitles.json");

// Leer el archivo de títulos procesados
export const readProcessedTitles = async (): Promise<Set<string>> => {
  try {
    const data = await fs.readFile(processedTitlesFile, "utf-8");
    return new Set(JSON.parse(data));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Si el archivo no existe, devolver un conjunto vacío
      return new Set();
    }
    throw error;
  }
};

// Escribir en el archivo de títulos procesados
export const writeProcessedTitles = async (
  titles: Set<string>
): Promise<boolean> => {
  try {
    await fs.writeFile(
      processedTitlesFile,
      JSON.stringify([...titles], null, 2)
    );
    return true;
  } catch (error) {
    console.error("Error writing processed titles:", error);
    return false;
  }
};

// Añadir un título al archivo de títulos procesados
export const addProcessedTitle = async (title: string): Promise<boolean> => {
  try {
    const titles = await readProcessedTitles();
    if (titles.has(title)) return false;
    titles.add(title);
    return await writeProcessedTitles(titles);
  } catch (error: any) {
    console.error("Error adding processed title:", error);
    return false;
  }
};
