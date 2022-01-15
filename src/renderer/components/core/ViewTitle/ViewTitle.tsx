import clsx from "clsx";

export interface ViewTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export function ViewTitle(props: ViewTitleProps) {
  const { className, children } = props;
  return (
    <h1 className={clsx(className, "text-4xl font-bold text-lego-navy")}>
      {children}
    </h1>
  );
}
