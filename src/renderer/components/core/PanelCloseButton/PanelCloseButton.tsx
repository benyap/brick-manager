import clsx from "clsx";

export interface PanelCloseButtonProps {
  onClose?: () => void;
}

export function PanelCloseButton(props: PanelCloseButtonProps) {
  const { onClose } = props;
  return (
    <button
      className={clsx(
        "mt-auto text-lego-navy bg-lego-navy rounded w-full py-2 text-sm shadow",
        "bg-opacity-5 hover:bg-opacity-10 active:bg-opacity-20 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-lego-navy focus:ring-opacity-60"
      )}
      onClick={onClose}
    >
      Close
    </button>
  );
}
