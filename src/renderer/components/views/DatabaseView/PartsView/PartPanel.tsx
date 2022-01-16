import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { IPart, IPartColors } from "~/models";
import { useCategoryById } from "~/hooks/data";

import { CubeIcon } from "~/components/icons/CubeIcon";
import PanelCloseButton from "~/components/core/PanelCloseButton";

import { PartPanelColors } from "./PartPanelColors";

export interface PartPanelProps {
  className?: string;
  part?: IPart;
  colors?: IPartColors["colors"];
  onClose?: () => void;
}

export function PartPanel(props: PartPanelProps) {
  const { className, part, colors, onClose } = props;
  const { id, name, image, externalIds, categoryId = "" } = part ?? {};
  const { BrickLink, LEGO } = externalIds ?? {};

  const category = useCategoryById(categoryId);
  const colorList = Object.keys(colors ?? {});

  const ref = useRef<HTMLImageElement>(null);
  const [selectedColorImage, setSelectedColorImage] = useState("");

  // Reset color when selected part changes
  useEffect(() => {
    setSelectedColorImage(image ?? "");
  }, [id, image]);

  return (
    <div
      className={clsx(
        className,
        "bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between"
      )}
    >
      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8">
        <div className="w-52 h-52 flex-shrink-0 mb-4">
          {image || selectedColorImage ? (
            <img
              ref={ref}
              className="opacity-0 transition-opacity w-full"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              src={selectedColorImage || image}
              alt={name}
            />
          ) : (
            <CubeIcon className="text-lego-navy opacity-25" />
          )}
        </div>
        <div className="flex flex-col gap-3">
          {BrickLink && BrickLink.length > 0 && (
            <div>
              <p className="text-sm font-medium text-lego-navy text-opacity-80">
                BrickLink ID
              </p>
              <ul>
                {BrickLink.map((id) => (
                  <li
                    key={part?.id + id}
                    className="text-xl lg:text-2xl text-lego-navy font-bold"
                  >
                    {id}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {LEGO && LEGO.length > 0 && (
            <div>
              <p className="text-sm font-medium text-lego-navy text-opacity-80">
                LEGO ID
              </p>
              <ul>
                {LEGO.map((id) => (
                  <li
                    key={part?.id + id}
                    className="text-xl lg:text-2xl text-lego-navy font-bold"
                  >
                    {id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="font-medium text-lego-navy text-opacity-80">
        {category ? category.name : <>Category {categoryId}</>}
      </p>
      <h2 className="text-lego-navy text-2xl lg:text-3xl font-bold">{name}</h2>
      {colorList.length > 1 && (
        <div className="mt-3">
          <h3 className="font-medium text-lego-navy text-opacity-80 mb-1">Colors</h3>
          <PartPanelColors
            partColors={colors}
            currentImage={selectedColorImage || image}
            onClick={(image) => {
              if (image === selectedColorImage) return;
              if (ref.current) ref.current.style.opacity = "0";
              setSelectedColorImage(image);
            }}
          />
        </div>
      )}
      {onClose && <PanelCloseButton onClose={onClose} />}
    </div>
  );
}
