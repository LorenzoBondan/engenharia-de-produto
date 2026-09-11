export const DTipoFilhoEnum = {
    MDP: { name: "MDP", value: 1, label: "MDP" },
    MDF: { name: "MDF", value: 2, label: "MDF" },
    ALUMINIO: { name: "ALUMINIO", value: 3, label: "Alumínio" },
    FUNDO: { name: "FUNDO", value: 4, label: "Fundo" },
} as const;

export const getLabel = (name: string): string | undefined => {
    return Object.values(DTipoFilhoEnum).find(item => item.name === name)?.label;
};