import { createContext, useContext, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import Fuse from "fuse.js";

import { IPart, ICategory, IColor } from "~/models";

import { loadParts } from "./loaders/parts";
import { loadCategories } from "./loaders/categories";
import { loadColors } from "./loaders/colors";

export interface IResource {
  parts?: {
    data: IPart[];
    search: Fuse<{ item: IPart }>;
  };
  categories?: {
    data: ICategory[];
    byId: Record<string, ICategory>;
    search: Fuse<ICategory>;
  };
  colors?: {
    data: IColor[];
    search: Fuse<{ item: IColor }>;
  };
}

const DEV = process.env.NODE_ENV === "development";

export const ResourceContext = createContext<IResource>({});

export function useResource<T extends keyof IResource>(
  key: T
): NonNullable<IResource[T]> {
  const resource = useContext(ResourceContext)[key];
  if (!resource) throw new Error(`Resource not loaded: ${key}`);
  return resource!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
      const state: IResource = {};
      state.parts = await loadParts();
      state.categories = await loadCategories();
      state.colors = await loadColors();
      setState(state);
    }
    Promise.allSettled([
      load(),
      new Promise((resolve) => setTimeout(resolve, DEV ? minimumWait : minimumWait)),
    ]).then(() => setLoading(false));
  }, [state, minimumWait]);

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
      <Transition
        show={!loading}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        {children}
      </Transition>
    </ResourceContext.Provider>
  );
}
