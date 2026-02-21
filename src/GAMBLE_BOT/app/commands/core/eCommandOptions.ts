export const eCommandOptions = {
    nocheck: "--no-check",
    show: "-show",
    add: "-add",
    delete: "-delete",
    single: "-single",
    datetimeRange: "--datetime-range",
} as const;

export type eCommandOptions = (typeof eCommandOptions)[keyof typeof eCommandOptions];
