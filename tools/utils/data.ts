import { writeFileSync } from "fs";

export const DATA_ROOT = "src/renderer/data";

export function writeData(path: string, data: any) {
  const dataPath = `${DATA_ROOT}/${path}`;
  const dataString = JSON.stringify(data, null, 2);
  writeFileSync(dataPath, dataString);
}
