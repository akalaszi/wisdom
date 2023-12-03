import axios from "axios";
import { DataFile } from "./DataFile";
import { logger } from "../Logger";

const URI = "http://www.omdbapi.com/?apikey=87dd4159&t=";

const visited = new Set<string>();

export async function fetchMovie(title: string): Promise<DataFile[]> {
  try {
    const cleanedTitle = title.trim().toLowerCase();
    if (cleanedTitle.length == 0 ) {
      logger.info(
        `OMDB fetch is skiped for empty title.`
      );
      return Promise.resolve([]);
    }
    if (visited.has(cleanedTitle)) {
      logger.info(
        `OMDB fetch is skiped for the movie title: \"${cleanedTitle}\" as it has been fetched before.`
      );
      return Promise.resolve([]);
    }

    logger.info(`OMDB fetch for the movie title: \"${cleanedTitle}\"`);
    const response = await axios.get(URI + cleanedTitle);
    const content = JSON.stringify(response.data).split("\n");
    visited.add(title);
    logger.info(`OMDB fetch done for the movie title: \"${cleanedTitle}\"`);
    return Promise.resolve([new DataFile(cleanedTitle, content)]);
  } catch (error) {
    logger.error(`Error fetching data: ${error}`);
    return Promise.resolve([]);
  }
}
