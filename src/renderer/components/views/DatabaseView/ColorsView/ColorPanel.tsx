import clsx from "clsx";

import { IColor, Vendor } from "~/models";

export interface ColorPanelProps {
  className?: string;
  color?: IColor;
}

export function ColorPanel(props: ColorPanelProps) {
  const { className, color } = props;
  const { name, material, rgb, externalIds = {}, externalNames = {} } = color ?? {};

  const bestName = externalNames?.BrickLink?.[0] ?? externalNames?.LEGO?.[0] ?? name;

  return (
    <div
      className={clsx(
        className,
        "mt-8 rounded shadow-md w-1/2 flex-shrink-0 lg:flex-shrink lg:w-2/3 bg-white p-6 max-w-[50%]",
        { hidden: !color }
      )}
    >
      <div className="flex flex-col-reverse lg:flex-row justify-between">
        <div className="mb-4">
          <h2 className="font-bold text-4xl lg:text-5xl text-lego-navy mb-1">
            {bestName}
          </h2>
          <p className="text-lego-navy text-opacity-60 text-xl lg:text-2xl font-semibold">
            {rgb}
          </p>
        </div>
        <div
          className="w-24 h-24 lg:w-28 lg:h-28 rounded-lg flex-shrink-0 border border-gray-300 shadow mb-4 lg:mb-0 lg:ml-4"
          style={{ background: rgb, opacity: material === "solid" ? 1 : 0.8 }}
        />
      </div>
      <div className="grid gap-5">
        {["BrickLink", "LEGO"].map((vendor: Vendor) => {
          return (
            <div key={vendor} className="">
              <h3 className="text-lego-navy text-opacity-90 font-semibold lg:text-lg lg:mb-1">
                {vendor} ID
              </h3>
              <table>
                <tbody>
                  {externalIds[vendor]?.map((id, index) => (
                    <tr
                      key={id}
                      className="text-lego-navy text-opacity-90 text-sm lg:text-base"
                    >
                      <td className="min-w-[40px] lg:min-w-[48px]">{id}</td>
                      <td>{externalNames[vendor]?.[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
