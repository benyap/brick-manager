import clsx from "clsx";

import { IColor } from "~/models";

import PanelCloseButton from "~/components/core/PanelCloseButton";

export interface ColorPanelProps {
  className?: string;
  color?: IColor;
  onClose?: () => void;
}

export function ColorPanel(props: ColorPanelProps) {
  const { className, color, onClose } = props;
  const { name, material, rgb, externalIds = {}, externalNames = {} } = color ?? {};

  const bestName = externalNames?.BrickLink?.[0] ?? externalNames?.LEGO?.[0] ?? name;

  return (
    <div
      className={clsx(
        className,
        "bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between",
        "overflow-y-auto overflow-x-hidden"
      )}
    >
      <div>
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
          {externalIds["BrickLink"] && (
            <VendorIDDisplay
              name="BrickLink"
              ids={externalIds["BrickLink"]}
              names={externalNames["BrickLink"]}
            />
          )}
          {externalIds["LEGO"] && (
            <VendorIDDisplay
              name="LEGO"
              ids={externalIds["LEGO"]}
              names={externalNames["LEGO"]}
            />
          )}
        </div>
      </div>
      {onClose && <PanelCloseButton onClose={onClose} />}
    </div>
  );
}

function VendorIDDisplay(props: { name: string; ids?: string[]; names?: string[] }) {
  const { name, ids, names } = props;
  return (
    <div>
      <h3 className="text-lego-navy text-opacity-90 font-semibold lg:text-lg lg:mb-1">
        {name} ID
      </h3>
      <table>
        <tbody>
          {ids?.map((id, index) => (
            <tr
              key={id}
              className="text-lego-navy text-opacity-90 text-sm lg:text-base"
            >
              <td className="min-w-[40px] lg:min-w-[48px]">{id}</td>
              <td>{names?.[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
