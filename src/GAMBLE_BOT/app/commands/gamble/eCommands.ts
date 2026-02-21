export const GAMBLE_COMMANDS = {
    GambleSync: "gb_sync",
    GbOpen: "gb_open",
    GbGame: "gb_game",
    GbBet: "gb_bet",
    GbResult: "gb_result",
    GbSync: "gb_sync",
    GbConfig: "gb_config",
} as const;

export type GambleCommand = (typeof GAMBLE_COMMANDS)[keyof typeof GAMBLE_COMMANDS];
