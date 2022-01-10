import { BrowserWindow, app, shell } from "electron";
import { join } from "path";

import { initStore } from "./init/db";

// Entry point of Electron app

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 720,
    width: 1200,
    minWidth: 320,
    minHeight: 192,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Ensure external links are opened in a browser window
  // ASSUMPTION: External links use the `ExternalLink` component
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Load React application
  mainWindow.loadURL(`file://${join(__dirname, "./index.html")}`);
}

app.on("ready", () => {
  initStore();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
