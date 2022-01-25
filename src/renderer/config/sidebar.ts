import { SideBarItemProps } from "~/components/core/SideBar";

export const sidebar: SideBarItemProps[] = [
  {
    name: "Inventory",
    to: "/inventory",
    icon: "PackageIcon",
  },
  {
    name: "Collections",
    to: "/collections",
    icon: "PuzzleIcon",
  },
  {
    name: "Database",
    to: "/database",
    icon: "DatabaseIcon",
  },
];
