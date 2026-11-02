export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function displayName(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value?.name || "";
}

export function toList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.trim() ? [value] : [];
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return value == null ? [] : [value];
}
