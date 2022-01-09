import { BrowserWindow, app } from "electron";

import { createWindow } from "./init/window";
import { initStore } from "./init/db";

// Entry point of Electron app

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
