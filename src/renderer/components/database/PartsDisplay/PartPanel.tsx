import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { IPart, IPartColors } from "~/types";

import PartColorSelector from "~/components/parts/PartColorSelector";
import PartImageWithIdentifiers from "~/components/parts/PartImageWithIdentifiers";
import PartCategoryHeading from "~/components/parts/PartCategoryHeading";
import Button from "~/components/elements/Button";

export interface PartPanelProps {
  className?: string;
  part?: IPart;
  partColors?: IPartColors["colors"];
  onClose?: () => void;
}

export function PartPanel(props: PartPanelProps) {
  const { className, part, partColors, onClose } = props;

  const colorList = Object.keys(partColors ?? {});

  const ref = useRef<HTMLImageElement>(null);
  const [selectedColorId, setSelectedColorId] = useState("");

  // Set the selected color when part changes
  useEffect(() => {
    if (part?.image && partColors) {
      for (const colorId of Object.keys(partColors)) {
        if (partColors[colorId] !== part.image) continue;
        return setSelectedColorId(colorId);
      }
    }
    setSelectedColorId("");
  }, [part, partColors]);

  return (
    <div
      className={clsx(
        className,
        "bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between",
        "overflow-y-auto overflow-x-hidden"
      )}
    >
      <div>
        <PartImageWithIdentifiers
          part={part}
          partColors={partColors}
          selectedColorId={selectedColorId}
        />
        <PartCategoryHeading part={part} />
        <h2 className="text-lego-navy text-2xl lg:text-3xl font-bold">
          {part?.name}
        </h2>
        {colorList.length > 1 && (
          <div className="mt-3">
            <h3 className="font-medium text-lego-navy-300 mb-1">Colors</h3>
            <PartColorSelector
              partColors={partColors}
              selectedColorId={selectedColorId}
              onClick={(colorId) => {
                if (colorId === selectedColorId) return;
                if (ref.current) ref.current.style.opacity = "0";
                setSelectedColorId(colorId);
              }}
            />
          </div>
        )}
      </div>
      {onClose && <Button onClick={onClose}>Close</Button>}
    </div>
  );
}
