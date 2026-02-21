import { GAMBLE_COMMANDS } from "../gamble/eCommands";
import { SPLAJINRO_COMMANDS } from "../splajinro/eCommands";

export const CORE_COMMANDS = {
    TeamBuilder: "spj_team_build",
    MessageCopy: "msg_copy",
} as const;

export const eCommands = {
    ...SPLAJINRO_COMMANDS,
    ...CORE_COMMANDS,
    ...GAMBLE_COMMANDS,
} as const;

export type eCommands = (typeof eCommands)[keyof typeof eCommands];
export const isMyCommand = (v: any): v is eCommands => Object.values(eCommands).some(elm => elm === v);
