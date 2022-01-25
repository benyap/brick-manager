import { createContext, useContext, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { Low } from "lowdb";
import Fuse from "fuse.js";

import { DatabaseSchema, ICategory, IColor, IPartWithColors } from "~/types";
import { loadParts, loadCategories, loadColors, loadDatabase } from "~/loaders";
import { InventoryLoader, InventoryItemLoader } from "~/models";

export interface IResource {
  parts?: {
    list: IPartWithColors[];
    byId: { [id: string]: IPartWithColors };
    search: Fuse<IPartWithColors>;
  };
  categories?: {
    list: ICategory[];
    byId: { [id: string]: ICategory };
    search: Fuse<ICategory>;
  };
  colors?: {
    list: IColor[];
    byId: { [id: string]: IColor };
    search: Fuse<{ color: IColor }>;
  };
  database?: Low<DatabaseSchema>;
  loaders?: {
    inventory: InventoryLoader;
    inventoryItems: InventoryItemLoader;
  };
}

const DEV = process.env.NODE_ENV === "development";

export const ResourceContext = createContext<IResource>({});

export function useResource<T extends keyof IResource>(
  key: T
): NonNullable<IResource[T]> {
  const resource = useContext(ResourceContext)[key];
  if (!resource) throw new Error(`Resource not loaded: ${key}`);
  return resource!;
}

export interface ResourceProviderProps {
  children?: React.ReactNode;
  loadingScreen?: React.ReactNode;
  minimumWait?: number;
}

export function ResourceProvider(props: ResourceProviderProps) {
  const { children, loadingScreen, minimumWait = 1000 } = props;

  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<IResource>();

  useEffect(() => {
    if (state) return;

    async function load() {
      // Load static data
      const state: IResource = {};
      state.parts = await loadParts();
      state.categories = await loadCategories();
      state.colors = await loadColors();

      // Load database
      const database = await loadDatabase();
      state.database = database;
      state.loaders = {
        inventory: await new InventoryLoader(database).load(),
        inventoryItems: await new InventoryItemLoader(database).load(),
      };

      setState(state);
    }

    Promise.all([
      load(),
      new Promise((resolve) => setTimeout(resolve, DEV ? 0 : minimumWait)),
    ]).then(() => setLoading(false));
  }, [state, minimumWait]);

  useEffect(() => {
    if (loading) return;
    document.body.classList.add("ready");
  }, [loading]);

  return (
    <ResourceContext.Provider value={state ?? {}}>
      <Transition
        show={loading}
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {loadingScreen}
      </Transition>
      {!loading && (
        <Transition
          show
          appear
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          {children}
        </Transition>
      )}
    </ResourceContext.Provider>
  );
}
