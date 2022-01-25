import { useMemo } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import clsx from "clsx";

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const parts = useMemo(() => {
    const segments = pathname.split("/");

    const parts: JSX.Element[] = [
      <Link
        key="dashboard"
        to="/"
        className={clsx(
          "uppercase tracking-widest px-1 text-sm font-medium ",
          "text-lego-navy-300 transition",
          "hover:text-lego-navy-200 rounded bm-focusable ring-2"
        )}
      >
        Dashboard
      </Link>,
    ];

    let partialPath = "";

    segments.forEach((segment, index) => {
      partialPath += "/" + segment;
      if (index !== segments.length - 1) {
        if (partialPath.slice(1)) {
          parts.push(
            <Link
              key={segment}
              to={partialPath.slice(1)}
              className={clsx(
                "uppercase tracking-widest px-1 text-sm font-medium",
                "text-lego-navy-300 transition",
                "hover:text-lego-navy-200 rounded bm-focusable ring-2"
              )}
            >
              {segment}
            </Link>
          );
        }
        parts.push(
          <div
            key={segment + "-separator"}
            className="uppercase tracking-widest text-sm text-lego-navy-300 font-medium px-3"
          >
            /
          </div>
        );
      } else {
        parts.push(
          <div
            key={segment}
            className="uppercase tracking-widest text-sm font-bold text-lego-navy-300"
          >
            {segment}
          </div>
        );
      }
    });

    return parts;
  }, [pathname]);

  return <div className="flex px-10 py-8">{parts}</div>;
}
