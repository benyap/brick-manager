import { useMemo } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const parts = useMemo(() => {
    const segments = pathname.split("/");

    const parts: JSX.Element[] = [
      <Link
        key="home"
        to="/"
        className="uppercase tracking-widest text-sm font-medium text-black text-opacity-80 hover:text-opacity-60 transition-all"
      >
        Home
      </Link>,
    ];

    let partialPath = "";

    segments.forEach((segment, index) => {
      partialPath += "/" + segment;
      if (index !== segments.length - 1) {
        parts.push(
          <Link
            key={segment}
            to={partialPath.slice(1)}
            className="uppercase tracking-widest text-sm font-medium text-black text-opacity-80 hover:text-opacity-60 transition-all"
          >
            {segment}
          </Link>
        );
        parts.push(
          <div
            key={segment + "-separator"}
            className="uppercase tracking-widest text-sm text-black text-opacity-80 font-medium px-3"
          >
            /
          </div>
        );
      } else {
        parts.push(
          <div
            key={segment}
            className="uppercase tracking-widest text-sm font-bold text-black text-opacity-80"
          >
            {segment}
          </div>
        );
      }
    });

    return parts;
  }, [pathname]);

  return <div className="flex">{parts}</div>;
}
