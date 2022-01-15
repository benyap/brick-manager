import { Outlet, useLocation } from "react-router";

import Breadcrumbs from "~/components/core/Breadcrumbs";

export interface BaseViewProps {
  className?: string;
  children?: React.ReactNode;
  root?: string;
  disableBreadcrumbs?: boolean;
}

export function BaseView(props: BaseViewProps) {
  const { className, children, root, disableBreadcrumbs } = props;
  const { pathname } = useLocation();

  // Return child elements if there is no root
  // OR if it matches the specified root
  if (!root || pathname === root) {
    return (
      <div className={className}>
        {!disableBreadcrumbs && <Breadcrumbs />}
        {children}
      </div>
    );
  }

  // Otherwise assume that it is a parent page, so render child routes
  return (
    <div className={className}>
      {!disableBreadcrumbs && <Breadcrumbs />}
      <Outlet />
    </div>
  );
}
