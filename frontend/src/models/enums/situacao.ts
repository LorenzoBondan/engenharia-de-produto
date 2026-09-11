export const DSituacaoEnum = {
    ATIVO: { name: "ATIVO", value: 1, label: "Ativo" },
    INATIVO: { name: "INATIVO", value: 2, label: "Inativo" },
    LIXEIRA: { name: "LIXEIRA", value: 3, label: "Lixeira" },
} as const;

export const getLabel = (name: string): string | undefined => {
    return Object.values(DSituacaoEnum).find(item => item.name === name)?.label;
};