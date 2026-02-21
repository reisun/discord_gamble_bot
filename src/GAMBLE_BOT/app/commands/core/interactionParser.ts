import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from "discord.js";
import { eCommandOptions } from "./eCommandOptions";
import { CORE_COMMANDS } from "./eCommands";

export const parseCoreInteraction = (
    _client: Client,
    interaction: ChatInputCommandInteraction,
    plainTextCommand: string,
): string => {
    for (const opt of interaction.options.data) {
        switch (interaction.commandName) {
            case CORE_COMMANDS.TeamBuilder:
                if (opt.type == ApplicationCommandOptionType.Integer && opt.name == "count") {
                    plainTextCommand += " " + opt.value;
                }
                break;
            case CORE_COMMANDS.MessageCopy:
                if (opt.type == ApplicationCommandOptionType.Subcommand && (opt.name == eCommandOptions.single || opt.name == eCommandOptions.datetimeRange)) {
                    plainTextCommand += " " + opt.name;
                    if (!opt.options) {
                        continue;
                    }
                    for (const subopt of opt.options) {
                        if (subopt.type == ApplicationCommandOptionType.Channel || subopt.type == ApplicationCommandOptionType.String) {
                            plainTextCommand += " " + subopt.value;
                        }
                    }
                }
                break;
        }
    }
    return plainTextCommand;
};
