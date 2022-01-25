import clsx from "clsx";

import { useResource } from "~/components/core/ResourceProvider";
import Tooltip from "~/components/elements/Tooltip";
import { IPart } from "~/types";

export interface PartCategoryHeadingProps {
  className?: string;
  part?: IPart;
}

export function PartCategoryHeading(props: PartCategoryHeadingProps) {
  const { className, part } = props;

  const { categoryId = "" } = part ?? {};
  const category = useResource("categories").byId[categoryId];

  return (
    <Tooltip title={categoryId ? `Category ${categoryId}` : ""} position="above">
      <span className={clsx("font-medium text-lego-navy-300", className)}>
        {category ? category.name : <>Category {categoryId}</>}
      </span>
    </Tooltip>
  );
}
