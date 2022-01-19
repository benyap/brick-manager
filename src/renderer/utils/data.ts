import { createReadStream } from "fs";
import { join } from "path";

export function dataPath(path: string) {
  if (process.env.NODE_ENV === "development") return join("data", path);
  return join(process.resourcesPath, "data", path);
}

export async function readFromStream(path: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = createReadStream(path);
    stream.on("error", reject);
    stream.on("data", (data) => chunks.push(Buffer.from(data)));
    stream.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf-8"));
    });
  });
}

export async function loadJSONData<T>(path: string): Promise<T> {
  const data = await readFromStream(dataPath(path));
  return JSON.parse(data) as T;
}
