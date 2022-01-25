import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { IPart, IPartColors } from "~/types";
import { brickLinkScraper } from "~/utils/bricklink";
import { CubeIcon } from "~/components/icons/CubeIcon";

export interface PartImageProps {
  className?: string;
  classes?: {
    image?: string;
    icon?: string;
  };
  part?: IPart;
  partColors?: IPartColors["colors"] | null;
  selectedColorId?: string;
  fade?: boolean;
}

export function PartImage(props: PartImageProps) {
  const {
    className,
    classes = {},
    part,
    partColors,
    selectedColorId = "",
    fade,
  } = props;

  const ref = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    // Reset if there is no part
    if (!part) return setImage("");

    // Set the image if a color is selected
    // or if there is a default part image available
    const selectedImage = partColors?.[selectedColorId] || part?.image;

    if (selectedImage) {
      setImage(selectedImage);
      if (fade && ref.current) {
        ref.current.style.opacity = "0";
        fetch(selectedImage).finally(() => (ref.current!.style.opacity = "1"));
      }
      return;
    }

    // Otherwise, try to fetch an image from BrickLink
    const brickLinkId = part?.identifiers?.BrickLink?.[0];
    if (!brickLinkId) return;

    if (fade && ref.current) ref.current.style.opacity = "0";

    const { controller, promise } = brickLinkScraper.getPartImages(brickLinkId);
    promise.then((images) => {
      const selectedImage = images[0];
      if (!selectedImage) return;
      setImage(selectedImage);
      if (fade && ref.current)
        fetch(selectedImage).finally(() => (ref.current!.style.opacity = "1"));
    });

    return () => {
      controller.abort();
    };
  }, [part, partColors, selectedColorId, fade]);

  return (
    <div className={className}>
      {image ? (
        <img
          ref={ref}
          className={clsx(
            "object-contain max-w-full max-h-full transition-opacity",
            classes.image
          )}
          src={image}
          alt={part?.name}
        />
      ) : (
        <CubeIcon className={clsx("text-lego-navy opacity-25", classes.icon)} />
      )}
    </div>
  );
}
