import clsx from "clsx";

export interface TextFieldProps {
  className?: string;
  id?: string;
  name?: string;
  label?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TextField(props: TextFieldProps) {
  const {
    className,
    id,
    name = id,
    label,
    type = "text",
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
        <input
          id={id}
          name={name}
          type={type}
          className="text-lego-navy focus:ring-lego-navy focus:border-lego-navy block w-full border-slate-300 rounded-md"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
