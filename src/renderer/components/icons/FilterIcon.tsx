import { IconProps } from "./props";

export function FilterIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M7 11h10v2H7zM4 7h16v2H4zm6 8h4v2h-4z"></path>
    </svg>
  );
}
