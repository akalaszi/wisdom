import fs from "fs";
import path from "path";
import { DataFile } from "./DataFile";
import { PORT } from "../server";


export function* traverseFiles(dir: string = "datasets"): Generator<DataFile> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const URI_PREFIX = `http://localhost:${PORT}/`;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* traverseFiles(fullPath);
    } else {
      const content = fs.readFileSync(fullPath, "utf-8").split("\n");
      yield new DataFile(URI_PREFIX + fullPath, content);
    }
  }
}
