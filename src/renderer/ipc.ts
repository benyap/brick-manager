import { ipcRenderer } from "electron";

import { MessageToMain } from "../ipc/types";

export async function getUserDataPath(): Promise<string> {
  const message: MessageToMain = { type: "getUserDataPath" };
  return new Promise<string>((resolve) => {
    ipcRenderer.once("asynchronous-reply", (_, reply) => {
      resolve(reply);
    });
    ipcRenderer.send("asynchronous-message", message);
  });
}
