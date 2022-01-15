import clsx from "clsx";

import { IPart } from "~/models";
import { useCategoryById } from "~/hooks/data";

import { CubeIcon } from "~/components/icons/CubeIcon";

export interface PartPanelProps {
  className?: string;
  part?: IPart;
}

export function PartPanel(props: PartPanelProps) {
  const { className, part } = props;
  const { name, image, externalIds, categoryId = "" } = part ?? {};
  const { BrickLink, LEGO } = externalIds ?? {};

  const category = useCategoryById(categoryId);

  return (
    <div
      className={clsx(
        className,
        "mt-8 rounded shadow-md w-1/2 flex-shrink-0 lg:flex-shrink lg:w-2/3 bg-white p-6 max-w-[50%]"
      )}
    >
      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8">
        <div className="w-52 h-52 flex-shrink-0 mb-4">
          {image ? (
            <img
              className="opacity-0 transition-opacity w-full"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              src={image}
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
      <p className="text-base font-medium text-lego-navy text-opacity-80">
        {category ? category.name : <>Category {categoryId}</>}
      </p>
      <h2 className="text-lego-navy text-2xl lg:text-3xl font-bold">{name}</h2>
    </div>
  );
}
