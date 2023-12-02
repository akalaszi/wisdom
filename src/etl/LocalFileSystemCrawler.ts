import fs from "fs";
import path from "path";
import { DataFile } from "./DataFile";

export function* traverseFiles(dir: string = "datasets"): Generator<DataFile> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* traverseFiles(fullPath);
    } else {
      const content = fs.readFileSync(fullPath, "utf-8").split("\n");
      yield new DataFile(fullPath, content);
    }
  }
}
