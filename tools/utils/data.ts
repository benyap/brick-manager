import { readFileSync, writeFileSync } from "fs";

export const DATA_ROOT = "data";

function getDataPath(path: string) {
  return `${DATA_ROOT}/${path}`;
}

export function writeData(path: string, data: any) {
  const dataPath = getDataPath(path);
  const dataString = JSON.stringify(data, null, 2);
  writeFileSync(dataPath, dataString);
}

export function getData<T>(path: string) {
  const dataPath = getDataPath(path);
  const data = readFileSync(dataPath);
  return JSON.parse(data.toString()) as T;
}
