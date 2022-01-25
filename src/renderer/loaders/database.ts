import { join } from "path";
import { Low, JSONFile } from "lowdb";

import { ID } from "~/config/constants";
import { Logger } from "~/utils/logger";
import { DatabaseSchema } from "~/types";
import { getUserDataPath } from "~/ipc";
import { Timer } from "~/utils/timer";

const INITIAL_STATE: DatabaseSchema = {
  inventories: [],
  inventoryItems: [],
  collections: [],
  collectionItems: [],
  assignments: [],
};

export async function loadDatabase() {
  const timer = Timer.start();

  const dataPath = await getUserDataPath();
  const filePath = join(dataPath, `${ID}-db.json`);
  const adapter = new JSONFile<DatabaseSchema>(filePath);
  const db = new Low<DatabaseSchema>(adapter);

  // Load db data from file
  await db.read();

  // Set initial data
  if (!db.data) {
    db.data = INITIAL_STATE;
    await db.write();
  }

  timer.stop();
  Logger.debug(
    loadDatabase.name,
    "Loaded database from",
    filePath,
    "in",
    timer.durationString
  );

  return db;
}
