import clsx from "clsx";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export function Button(props: ButtonProps) {
  const { className, children, ...buttonProps } = props;
  return (
    <button
      className={clsx(
        className,
        "text-lego-navy rounded w-full py-2 text-sm shadow",
        "bg-lego-navy bg-opacity-5 hover:bg-opacity-10 active:bg-opacity-20 transition",
        "focus:outline-none focus:ring-2 focus:ring-lego-navy focus:ring-opacity-60"
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
