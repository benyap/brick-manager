import clsx from "clsx";
import { useMemo } from "react";

import { CheckCircleIcon } from "~/components/icons/CheckCircleIcon";
import { ErrorCircleIcon } from "~/components/icons/ErrorCircleIcon";
import { ErrorTriangleIcon } from "~/components/icons/ErrorTriangleIcon";
import { InfoIcon } from "~/components/icons/InfoIcon";
import { XCircleIcon } from "~/components/icons/XCircleIcon";

export interface AlertProps {
  className?: string;
  type?: "info" | "warn" | "error" | "success" | "failure";
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Alert(props: AlertProps) {
  const { className, type, title, children, icon } = props;

  const defaultIcon = useMemo(() => {
    switch (type) {
      case "info":
        return <InfoIcon className="w-5 h-5 text-blue-400" aria-hidden="true" />;
      case "warn":
        return (
          <ErrorTriangleIcon
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
          />
        );
      case "error":
        return (
          <ErrorCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
        );
      case "success":
        return (
          <CheckCircleIcon className="w-5 h-5 text-green-400" aria-hidden="true" />
        );
      case "failure":
        return <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />;
    }
  }, [type]);

  return (
    <div
      className={clsx("rounded-md p-4", className, {
        "bg-green-50": type === "success",
        "bg-blue-50": type === "info",
        "bg-yellow-50": type === "warn",
        "bg-red-50": type === "error" || type === "failure",
      })}
    >
      <div className="flex">
        {defaultIcon && <div className="flex-shrink-0">{icon ?? defaultIcon}</div>}
        <div className={clsx({ "ml-2": Boolean(defaultIcon) })}>
          {title && (
            <h3
              className={clsx("text-sm font-medium", {
                "text-green-800": type === "success",
                "text-blue-800": type === "info",
                "text-yellow-800": type === "warn",
                "text-red-800": type === "error" || type === "failure",
              })}
            >
              {title}
            </h3>
          )}
          <div
            className={clsx("mt-2 last:mt-0 text-sm", {
              "text-green-700": type === "success",
              "text-blue-700": type === "info",
              "text-yellow-700": type === "warn",
              "text-red-700": type === "error" || type === "failure",
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
