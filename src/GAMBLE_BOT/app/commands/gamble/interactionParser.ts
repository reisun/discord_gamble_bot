import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from "discord.js";
import { GAMBLE_COMMANDS } from "./eCommands";

export const parseGambleInteraction = (
    _client: Client,
    interaction: ChatInputCommandInteraction,
    plainTextCommand: string,
): string => {
    for (const opt of interaction.options.data) {
        switch (interaction.commandName) {
            case GAMBLE_COMMANDS.GambleSync:
                if (opt.type == ApplicationCommandOptionType.String) {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbOpen:
                if ((opt.type == ApplicationCommandOptionType.Integer && opt.name == "initial_point")
                    || (opt.type == ApplicationCommandOptionType.String && (opt.name == "gm_password" || opt.name == "sync_to"))) {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbGame:
                if (opt.type == ApplicationCommandOptionType.String && (opt.name == "action" || opt.name == "game_id")) {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbBet:
                if ((opt.type == ApplicationCommandOptionType.String && (opt.name == "game_id" || opt.name == "ticket"))
                    || (opt.type == ApplicationCommandOptionType.Integer && opt.name == "point")) {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbResult:
                if (opt.type == ApplicationCommandOptionType.String && (opt.name == "game_id" || opt.name == "winning_ticket")) {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbSync:
                if (opt.type == ApplicationCommandOptionType.String && opt.name == "sync_to") {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case GAMBLE_COMMANDS.GbConfig:
                if (opt.type == ApplicationCommandOptionType.String && (opt.name == "gm_password" || opt.name == "sync_to")) {
                    plainTextCommand += " " + opt.value;
                }
                break;
        }
    }

    return plainTextCommand;
};
