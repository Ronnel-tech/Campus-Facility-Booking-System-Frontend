export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function displayName(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value?.name || "";
}
