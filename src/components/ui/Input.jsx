export default function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border-2 rounded-base font-sans text-sm transition-colors
          ${error ? "border-error bg-red-50" : "border-neutral-200 hover:border-neutral-300 focus:border-primary-500"}
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20
          placeholder-neutral-400
          ${className}`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-neutral-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
}
