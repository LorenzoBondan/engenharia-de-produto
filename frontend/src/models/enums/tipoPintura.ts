export const DTipoPinturaEnum = {
    ACETINADA: { name: "ACETINADA", value: 1, label: "Acetinada" },
    ALTO_BRILHO: { name: "ALTO_BRILHO", value: 2, label: "Alto Brilho" },
    ACETINADA_VIDRO: { name: "ACETINADA_VIDRO", value: 3, label: "Acetinada Vidro" },
} as const;

export const getLabel = (name: string): string | undefined => {
    return Object.values(DTipoPinturaEnum).find(item => item.name === name)?.label;
};
