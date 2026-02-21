export const SPLAJINRO_COMMANDS = {
    Member: "spj_member",
    SuggestRole: "spj_role",
    SendRole: "spj_send_role",
    CreateVote: "spj_vote",
    EjectFromVote: "spj_eject",
    SendRoleOption: "spj_send_role_option",
    ClearMemberData: "spj_clear",
} as const;

export type SplajinroCommand = (typeof SPLAJINRO_COMMANDS)[keyof typeof SPLAJINRO_COMMANDS];
