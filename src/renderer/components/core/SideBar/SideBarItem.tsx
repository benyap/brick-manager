import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import clsx from "clsx";

export interface SideBarItemProps {
  name?: string;
  to?: string;
}

export function SideBarItem(props: SideBarItemProps) {
  const { name, to = "#" } = props;
  const { pathname } = useLocation();
  const home = to === "/";
  const onPath = home ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={clsx(
        "uppercase font-semibold text-lg rounded px-5 py-3 hover:bg-white hover:bg-opacity-40 active:bg-opacity-50 transition-all",
        { "bg-white bg-opacity-40": onPath }
      )}
    >
      {name}
    </Link>
  );
}
