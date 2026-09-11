export function formatDate(dateString: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("Invalid date format, use 'yyyy-MM-dd'.");
    }
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

export function formatLocalDateTime(localDateTime: string): string {
    const match = localDateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    
    if (!match) {
        throw new Error("Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'.");
    }

    const [, year, month, day, hour, minute] = match;
    return `${day}/${month}/${year} - ${hour}:${minute}`;
}
