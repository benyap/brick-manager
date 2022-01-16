import { useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import { useDocumentBody, usePortalNode } from "~/hooks/dom";

export interface TooltipProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  position?: "left" | "right" | "below" | "above";
  margin?: 4 | 8 | 12;
}

function calculateTooltipPosition(
  position: TooltipProps["position"],
  margin: number,
  root: DOMRect,
  target: DOMRect,
  tooltip: DOMRect
): { top: string; left: string } {
  let top = 0;
  let left = 0;

  const setCenterX = () => (left = target.x + target.width / 2 - tooltip.width / 2);
  const setCenterY = () => (top = target.y + (target.height - tooltip.height) / 2);

  const setAbove = () => (top = target.y - tooltip.height - margin);
  const setBelow = () => (top = target.y + tooltip.height + margin);
  const setLeft = () => (left = target.x - tooltip.width - margin);
  const setRight = () => (left = target.x + target.width + margin);

  switch (position) {
    case "above":
      setCenterX();
      setAbove();
      break;
    case "below":
      setCenterX();
      setBelow();
      break;
    case "left":
      setCenterY();
      setLeft();
      break;
    case "right":
      setCenterY();
      setRight();
      break;
  }

  if (top < 0) setBelow();
  else if (top + tooltip.height > root.height) setAbove();

  if (left < 0) setRight();
  else if (left + tooltip.width > root.width) setLeft();

  return { top: `${top}px`, left: `${left}px` };
}

export function Tooltip(props: TooltipProps) {
  const { className, children, title, position = "above", margin = 8 } = props;

  const body = useDocumentBody();
  const portal = usePortalNode();
  const target = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);

  function showTooltip() {
    if (!tooltip.current || !target.current || !tooltip.current) return;

    tooltip.current.style.display = "block";

    const { top, left } = calculateTooltipPosition(
      position,
      margin,
      body.getBoundingClientRect(),
      target.current.getBoundingClientRect(),
      tooltip.current.getBoundingClientRect()
    );

    tooltip.current.style.top = top;
    tooltip.current.style.left = left;
  }

  function hideTooltip() {
    if (!tooltip.current) return;
    tooltip.current.style.display = "none";
  }

  return (
    <>
      <div ref={target} onMouseOver={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
      {createPortal(
        <div
          ref={tooltip}
          className={clsx(
            className,
            "absolute text-sm bg-lego-navy bg-opacity-90 text-white px-2 py-1 rounded w-max",
            "z-50 pointer-events-none hidden top-0"
          )}
        >
          {title}
        </div>,
        portal
      )}
    </>
  );
}
