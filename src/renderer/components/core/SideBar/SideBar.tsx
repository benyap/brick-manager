import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { NAME, VERSION } from "~/config/constants";
import { sidebar } from "~/config/sidebar";

import ExternalLink from "~/components/elements/ExternalLink";
import { CubeIcon } from "~/components/icons/CubeIcon";

import { SideBarItem } from "./SideBarItem";

export function SideBar() {
  return (
    <div className="flex h-screen">
      <aside className="bg-lego-yellow lg:w-[300px] flex-shrink-0 px-4 lg:px-6 py-8 flex flex-col justify-between shadow-lg">
        <div>
          <Link
            to="/"
            className={clsx(
              "flex flex-col items-center justify-center p-1 lg:p-3 rounded bm-clickable transition",
              "hover:bg-white hover:bg-opacity-40 bm-focusable ring"
            )}
          >
            <CubeIcon className="w-10 lg:w-20 text-lego-navy" />
            <h2 className="font-bold text-2xl mt-2 tracking-wide text-lego-navy hidden lg:block">
              Brick Manager
            </h2>
          </Link>
          <div className="flex flex-col gap-2 my-8">
            {sidebar.map((item) => (
              <SideBarItem key={item.name} {...item} />
            ))}
          </div>
        </div>
        <div className="hidden lg:flex flex-col">
          <p className="text-lego-navy text-opacity-50 text-sm px-5">
            {NAME} v{VERSION}
          </p>
          <p className="text-lego-navy text-opacity-50 text-sm px-5">
            Made with ♥ by{" "}
            <ExternalLink
              href="https://github.com/benyap/brick-manager"
              className={clsx(
                "text-lego-navy text-opacity-50 -ml-1 px-1 transition",
                "hover:text-opacity-70 rounded bm-focusable ring-2"
              )}
            >
              benyap
            </ExternalLink>
          </p>
        </div>
      </aside>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto min-w-[560px]">
        <Outlet />
      </div>
    </div>
  );
}
