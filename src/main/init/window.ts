import { join } from "path";
import { BrowserWindow } from "electron";

export function createWindow() {
  return new BrowserWindow({
    height: 720,
    width: 1200,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  }).loadURL(`file://${join(__dirname, "./index.html")}`);
}
