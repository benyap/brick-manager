import { join } from "path";
import { BrowserWindow, app, shell, MenuItemConstructorOptions } from "electron";
import contextMenu from "electron-context-menu";

import "./ipc";

// Entry point of Electron app

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 720,
    width: 1200,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      spellcheck: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  contextMenu({
    menu(actions, props, window, dictionary) {
      const items: MenuItemConstructorOptions[] = dictionary;

      items.push(actions.separator());
      items.push(actions.lookUpSelection({}));
      items.push(actions.searchWithGoogle({}));
      items.push(actions.separator());
      items.push(actions.cut({}));
      items.push(actions.copy({}));
      items.push(actions.paste({}));
      items.push(actions.separator());
      items.push(actions.copyImage({}));
      items.push(actions.saveImage({}));
      items.push(actions.saveImageAs({}));

      if (process.env.NODE_ENV === "development") {
        items.push(actions.separator());
        items.push(actions.inspect());
      }

      return items;
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
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
