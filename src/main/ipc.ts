import { app, ipcMain } from "electron";

import { MessageToMain } from "../ipc/types";

ipcMain.on("asynchronous-message", (event, arg: MessageToMain) => {
  switch (arg.type) {
    case "getUserDataPath":
      event.reply("asynchronous-reply", app.getPath("userData"));
      break;
  }
});
