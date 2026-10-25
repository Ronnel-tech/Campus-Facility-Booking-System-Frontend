export default function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}) {
  const baseStyles = "bg-white border border-neutral-200 rounded-lg p-4";
  const hoverStyles = hoverable ? "hover:shadow-md hover:border-neutral-300 transition-all" : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
