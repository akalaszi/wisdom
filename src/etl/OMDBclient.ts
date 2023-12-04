import axios from "axios";
import { DataFile } from "./DataFile";
import { logger } from "../Logger";

const URI = "http://www.omdbapi.com/?apikey=87dd4159&t=";

const visited = new Set<string>();

export async function fetchMovie(title: string): Promise<DataFile[]> {
  try {
    const uri = toUri(title);
    if (visited.has(uri)) {
      logger.info(
        `OMDB fetch is skiped for the movie uri: \"${uri}\" as it has been fetched before.`
      );
      return Promise.resolve([]);
    }

    logger.info(`OMDB fetch for the movie title: \"${uri}\"`);
    const response = await axios.get(uri);
    const content = JSON.stringify(response.data).split("\n");
    visited.add(title);
    logger.info(`OMDB fetch done for the movie title: \"${uri}\"`);
    return Promise.resolve([new DataFile(uri, content)]);
  } catch (error) {
    logger.error(`Error fetching data: ${error}`);
    return Promise.resolve([]);
  }
}
export function toUri(title:String) { 
  return URI + title.trim().toLowerCase();
}
