import { createReadStream } from "fs";

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
