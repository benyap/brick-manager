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
        "text-lg p-8  h-full rounded min-w-[160px] 2xl:min-h-[200px] shadow-lg",
        "bg-lego-yellow hover:opacity-80 active:opacity-70 transition-all",
        "flex flex-col justify-center items-center text-center",
        "aspect-square 5xl:aspect-auto"
      )}
    >
      <div className="aspect-square w-[64px] mb-2">{iconElement}</div>
      <h3 className="text-sm lg:text-base">{name}</h3>
    </Link>
  );
}
