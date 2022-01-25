import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { useIconByName } from "~/hooks/icon";

export interface SideBarItemProps {
  name?: string;
  icon?: string;
  to?: string;
}

export function SideBarItem(props: SideBarItemProps) {
  const { name, to = "#", icon } = props;
  const { pathname } = useLocation();
  const home = to === "/";
  const onPath = home ? pathname === "/" : pathname.startsWith(to);
  const [iconElement] = useIconByName(icon);
  return (
    <Link
      to={to}
      className={clsx(
        "p-3 lg:px-5 lg:py-3",
        "flex items-center justify-center lg:justify-start",
        "uppercase font-semibold text-lg text-lego-navy rounded transition",
        "hover:bg-white hover:bg-opacity-40 bm-clickable bm-focusable ring",
        { "bg-white bg-opacity-40": onPath }
      )}
    >
      <span className="w-6 text-lego-navy">{iconElement}</span>
      <span className="hidden lg:inline lg:ml-3 text-lego-navy">{name}</span>
    </Link>
  );
}
