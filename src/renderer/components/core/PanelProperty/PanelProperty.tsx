export interface PanelPropertyProps {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  hiddenIf?: any;
}

export function PanelProperty(props: PanelPropertyProps) {
  const { className, title, children, hiddenIf } = props;
  if (hiddenIf) return null;
  return (
    <div className={className}>
      <p className="text-lego-navy-300 font-medium text-sm mb-1">{title}</p>
      {children}
    </div>
  );
}
