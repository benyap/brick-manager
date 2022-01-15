import { SideBarItemProps } from "~/components/core/SideBar";

export const sidebar: SideBarItemProps[] = [
  {
    name: "Inventory",
    to: "/inventory",
    icon: "PackageIcon",
  },
  {
    name: "Builds",
    to: "/builds",
    icon: "PuzzleIcon",
  },
  {
    name: "Database",
    to: "/database",
    icon: "DatabaseIcon",
  },
];
