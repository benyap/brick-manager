import { useEffect, useRef, useState } from "react";
import { ListChildComponentProps } from "react-window";
import clsx from "clsx";

import { IPart } from "~/models";
import { brickLinkScraper } from "~/utils/bricklink";

import { CubeIcon } from "~/components/icons/CubeIcon";

export interface PartItemProps {
  part: IPart;
  compact?: boolean;
  onClick?: (part: IPart) => any;
}

export function PartItem(props: ListChildComponentProps<PartItemProps[]>) {
  const { index, data, style } = props;

  const { part, onClick, compact } = data[index];

  const ref = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState("");

  // Try to fetch image from BrickLink if one is not available
  useEffect(() => {
    if (ref.current) ref.current.style.opacity = "0";
    if (part.image) return setImage(part.image);

    setImage("");

    const brickLinkId = part?.identifiers?.BrickLink?.[0];
    if (!brickLinkId) return;

    const { controller, promise } = brickLinkScraper.getPartImages(brickLinkId);
    promise.then((images) => {
      if (images[0]) setImage(images[0]);
    });

    return () => controller.abort();
  }, [part]);

  return (
    <div style={style} className="p-2">
      <button
        className={clsx(
          "flex bg-white shadow-md w-full text-left transition-all",
          "hover:opacity-90 hover:cursor-pointer bm-clickable ring bm-focusable",
          {
            "p-5 rounded-lg": !compact,
            "px-4 py-3 rounded items-center": compact,
          }
        )}
        onClick={() => onClick?.(part)}
      >
        <div
          className={clsx("flex-shrink-0", {
            "w-8 h-8": compact,
            "w-24 h-24": !compact,
          })}
        >
          {image ? (
            <img
              ref={ref}
              className="opacity-0 transition-opacity object-contain rounded-sm max-w-full max-h-full"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              onError={() => {
                console.warn("Failed to load image for", part.id);
                setImage("");
              }}
              src={image}
              alt={part.name}
            />
          ) : (
            <CubeIcon className="text-lego-navy opacity-25" />
          )}
        </div>
        {compact ? (
          <h3 className="ml-4 text-lego-navy truncate">
            <span className="font-bold mr-2">
              {part.identifiers?.BrickLink?.[0]}
            </span>{" "}
            {part.name}
          </h3>
        ) : (
          <div className="ml-6 text-lego-navy overflow-hidden">
            <p className="font-bold truncate">
              {part.identifiers?.BrickLink?.join(", ")}
            </p>
            <h3 className="text-lg truncate">{part.name}</h3>
          </div>
        )}
      </button>
    </div>
  );
}
