export function toTitleCase(str?: string) {
  if (!str || str?.length == 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}
