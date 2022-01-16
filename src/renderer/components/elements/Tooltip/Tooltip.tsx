import clsx from "clsx";

export interface TooltipProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  position?: "left" | "right" | "below" | "above";
}

export function Tooltip(props: TooltipProps) {
  const { className, children, title, position = "above" } = props;
  return (
    <div className="relative flex justify-center items-center">
      <div className="peer">{children}</div>
      <span
        className={clsx(
          className,
          "absolute text-sm bg-lego-navy bg-opacity-90 text-white px-2 py-1 rounded w-max",
          "z-50 hidden peer-hover:block",
          {
            "bottom-[100%]": position === "above",
            "top-[100%]": position === "below",
            "right-[100%]": position === "left",
            "left-[100%]": position === "right",
          }
        )}
      >
        {title}
      </span>
    </div>
  );
}
