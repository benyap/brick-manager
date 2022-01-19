import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { IPart, IPartColors } from "~/models";
import { useCategoryById } from "~/hooks/data";
import { brickLinkScraper } from "~/utils/bricklink";

import { CubeIcon } from "~/components/icons/CubeIcon";
import PanelCloseButton from "~/components/core/PanelCloseButton";
import Tooltip from "~/components/elements/Tooltip";

import { PartPanelColors } from "./PartPanelColors";

export interface PartPanelProps {
  className?: string;
  part?: IPart;
  colors?: IPartColors["colors"];
  onClose?: () => void;
}

export function PartPanel(props: PartPanelProps) {
  const { className, part, colors, onClose } = props;
  const { id, name, image, identifiers, categoryId = "" } = part ?? {};
  const { BrickLink, LEGO } = identifiers ?? {};

  const category = useCategoryById(categoryId);
  const colorList = Object.keys(colors ?? {});

  const ref = useRef<HTMLImageElement>(null);
  const [selectedImage, setSelectedImage] = useState("");

  // Try to fetch image from BrickLink if one is not available
  useEffect(() => {
    if (ref.current) ref.current.style.opacity = "0";
    if (image) return setSelectedImage(image);

    setSelectedImage("");

    const brickLinkId = BrickLink?.[0];
    if (!brickLinkId) return;

    const { controller, promise } = brickLinkScraper.getPartImages(brickLinkId);
    promise.then((images) => {
      if (images[0]) setSelectedImage(images[0]);
    });

    return () => controller.abort();
  }, [id, image, BrickLink]);

  return (
    <div
      className={clsx(
        className,
        "bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between",
        "overflow-y-auto overflow-x-hidden"
      )}
    >
      <div>
        <div className="flex flex-wrap gap-8 mb-4">
          <div className="w-52 h-52 flex-shrink-0 flex items-center justify-center">
            {selectedImage || image ? (
              <img
                ref={ref}
                className="opacity-0 transition-opacity object-contain rounded-md max-w-full max-h-full"
                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                src={selectedImage || image}
                alt={name}
              />
            ) : (
              <CubeIcon className="text-lego-navy opacity-25" />
            )}
          </div>
          <div className="flex flex-col gap-3">
            {BrickLink && BrickLink.length > 0 && (
              <VendorIDs name="BrickLink" ids={BrickLink} />
            )}
            {LEGO && LEGO.length > 0 && <VendorIDs name="LEGO" ids={LEGO} />}
          </div>
        </div>
        <Tooltip title={categoryId ? `Category ${categoryId}` : ""} position="left">
          <p className="font-medium text-lego-navy text-opacity-80">
            {category ? category.name : <>Category {categoryId}</>}
          </p>
        </Tooltip>
        <h2 className="text-lego-navy text-2xl lg:text-3xl font-bold">{name}</h2>
        {colorList.length > 1 && (
          <div className="mt-3">
            <h3 className="font-medium text-lego-navy text-opacity-80 mb-1">
              Colors
            </h3>
            <PartPanelColors
              partColors={colors}
              currentImage={selectedImage || image}
              onClick={(image) => {
                if (image === selectedImage) return;
                if (ref.current) ref.current.style.opacity = "0";
                setSelectedImage(image);
              }}
            />
          </div>
        )}
      </div>
      {onClose && <PanelCloseButton className="mt-5" onClose={onClose} />}
    </div>
  );
}

export function VendorIDs(props: { name: string; ids: string[] }) {
  const { name, ids } = props;
  return (
    <div>
      <p className="text-sm font-medium text-lego-navy text-opacity-80">{name} ID</p>
      <ul>
        {ids.map((id) => (
          <li key={id} className="text-xl lg:text-2xl text-lego-navy font-bold">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}
