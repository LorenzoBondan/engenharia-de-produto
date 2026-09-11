export const DTipoMaterialEnum = {
    CHAPA_MDP: { name: "CHAPA_MDP", value: 1, label: "Chapa MDP" },
    CHAPA_MDF: { name: "CHAPA_MDF", value: 2, label: "Chapa MDF" },
    FITA_BORDA: { name: "FITA_BORDA", value: 3, label: "Fita Borda" },
    COLA: { name: "COLA", value: 4, label: "Cola" },
    CANTONEIRA: { name: "CANTONEIRA", value: 5, label: "Cantoneira" },
    TNT: { name: "TNT", value: 6, label: "Tnt" },
    POLIETILENO: { name: "POLIETILENO", value: 7, label: "Polietileno" },
    PLASTICO: { name: "PLASTICO", value: 8, label: "Plástico" },
    PINTURA: { name: "PINTURA", value: 9, label: "Pintura" },
    PINTURA_DE_BORDA_DE_FUNDO: { name: "PINTURA_DE_BORDA_DE_FUNDO", value: 10, label: "Pintura de borda de fundo" },
    POLIESTER: { name: "POLIESTER", value: 11, label: "Poliéster" },
    BAGUETE: { name: "BAGUETE", value: 12, label: "Baguete" },
} as const;

export const getLabel = (name: string): string | undefined => {
    return Object.values(DTipoMaterialEnum).find(item => item.name === name)?.label;
};