import clsx from "clsx";

import { IconTile, IconTileProps } from "./IconTile";

export interface IconTileGridProps {
  tiles?: IconTileProps[];
}

export function IconTileGrid(props: IconTileGridProps) {
  const { tiles } = props;
  return (
    <div
      className={clsx(
        "grid gap-4 xl:gap-6",
        "grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 5xl:grid-cols-8"
      )}
    >
      {tiles?.map((tile) => (
        <IconTile key={tile.name} {...tile} />
      ))}
    </div>
  );
}
