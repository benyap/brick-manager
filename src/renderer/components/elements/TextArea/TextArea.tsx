import clsx from "clsx";

export interface TextAreaProps {
  className?: string;
  id?: string;
  name?: string;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TextArea(props: TextAreaProps) {
  const {
    className,
    id,
    name = id,
    label,
    placeholder,
    value,
    onChange,
    disabled,
  } = props;
  return (
    <div className={clsx(className, { "opacity-60": disabled })}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-lego-navy-300">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea
          id={id}
          name={name}
          className="text-lego-navy focus:ring-lego-navy focus:border-lego-navy block w-full border-slate-300 rounded-md min-h-[64px]"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
