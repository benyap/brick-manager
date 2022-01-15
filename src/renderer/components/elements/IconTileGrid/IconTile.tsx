import clsx from "clsx";
import { Link } from "react-router-dom";

import { useIconByName } from "~/hooks/icon";

export interface IconTileProps {
  name?: string;
  to?: string;
  icon?: string;
}

export function IconTile(props: IconTileProps) {
  const { name, to = "#", icon } = props;

  const [iconElement] = useIconByName(icon, IconTile.name);

  return (
    <Link
      to={to}
      className={clsx(
        "block text-lg w-40 lg:w-48 aspect-square rounded shadow-lg",
        "bg-lego-yellow hover:opacity-80 transition-all",
        "flex flex-col justify-center items-center text-center",
        "bm-focusable ring bm-clickable"
      )}
    >
      <div className="aspect-square w-[48px] lg:w-[64px] mb-3 lg:mb-4 text-lego-navy">
        {iconElement}
      </div>
      <h3 className="lg:text-xl font-semibold text-lego-navy">{name}</h3>
    </Link>
  );
}
