export interface ExternalLinkProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

export function ExternalLink(props: ExternalLinkProps) {
  const { className, children, href } = props;
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
