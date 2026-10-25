export default function Badge({ children, variant = "neutral", className = "", ...props }) {
  const variants = {
    neutral: "bg-neutral-100 text-neutral-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-warning bg-opacity-10 text-warning",
    error: "bg-error bg-opacity-10 text-error",
    approved: "bg-primary-500 text-white",
    pending: "bg-warning bg-opacity-20 text-warning",
    rejected: "bg-error bg-opacity-20 text-error",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
