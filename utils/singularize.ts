export function singularize(str?: string) {
    if (!str) {
        return '';
    }
    const end = str.charAt(str.length - 1);
    if (end == 's') {
        return str.substring(0, str.length - 1);
    }
    return str;
}
