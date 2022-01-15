import clsx from "clsx";

import { IconTile, IconTileProps } from "./IconTile";

export interface IconTileGridProps {
  className?: string;
  tiles?: IconTileProps[];
}

export function IconTileGrid(props: IconTileGridProps) {
  const { className, tiles } = props;
  return (
    <div className={clsx("flex flex-wrap gap-4", className)}>
      {tiles?.map((tile) => (
        <IconTile key={tile.name} {...tile} />
      ))}
    </div>
  );
}
