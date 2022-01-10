import { Outlet } from "react-router-dom";

import { NAME, VERSION } from "~/config/constants";
import { sidebar } from "~/config/sidebar";

import ExternalLink from "~/components/core/ExternalLink";

import { SideBarItem } from "./SideBarItem";

export function SideBar() {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-lego-yellow w-[300px] flex-shrink-0 px-6 py-8 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="uppercase font-bold text-4xl px-5 tracking-wide">
            Brick Manager
          </h2>
          <div className="flex flex-col gap-1 my-8">
            {sidebar.map((item) => (
              <SideBarItem key={item.name} {...item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-black text-opacity-30 text-sm px-5">
            {NAME} v{VERSION}
          </p>
          <p className="text-black text-opacity-30 text-sm px-5">
            Made with ♥ by{" "}
            <ExternalLink
              href="https://github.com/benyap/brick-manager"
              className="text-black text-opacity-30 hover:text-opacity-60 transition-all"
            >
              benyap
            </ExternalLink>
          </p>
        </div>
      </aside>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
