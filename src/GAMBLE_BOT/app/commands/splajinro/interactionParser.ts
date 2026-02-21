import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from "discord.js";
import { User as MyUser } from "../../Model";
import { eCommandOptions } from "../core/eCommandOptions";
import { SPLAJINRO_COMMANDS } from "./eCommands";

export const parseSplajinroInteraction = async (
    client: Client,
    interaction: ChatInputCommandInteraction,
    plainTextCommand: string,
    mentionUsers: MyUser[],
): Promise<{ plainTextCommand: string, mentionUsers: MyUser[] }> => {
    for (const opt of interaction.options.data) {
        switch (interaction.commandName) {
            case SPLAJINRO_COMMANDS.Member:
            case SPLAJINRO_COMMANDS.EjectFromVote:
                if (opt.type == ApplicationCommandOptionType.String && opt.name == "option") {
                    plainTextCommand += " " + opt.value;
                }
                else if (opt.type == ApplicationCommandOptionType.User) {
                    const userid = <string>opt.value;
                    const user = (await client.users.fetch(userid));
                    mentionUsers.push({ id: userid, name: user.displayName });
                }
                break;
            case SPLAJINRO_COMMANDS.SuggestRole:
                if (opt.type == ApplicationCommandOptionType.Subcommand && opt.name == "create") {
                    if (!opt.options) {
                        continue;
                    }
                    for (const subopt of opt.options) {
                        if (subopt.type == ApplicationCommandOptionType.String && (subopt.name == "name" || subopt.name.match(/^role/))) {
                            plainTextCommand += " " + subopt.value;
                        }
                    }
                }
                break;
            case SPLAJINRO_COMMANDS.SendRole:
                if (opt.type == ApplicationCommandOptionType.Subcommand && opt.name == eCommandOptions.nocheck) {
                    plainTextCommand += " " + opt.name;
                    if (!opt.options) {
                        continue;
                    }
                    for (const subopt of opt.options) {
                        if (subopt.type == ApplicationCommandOptionType.String && (subopt.name == "name" || subopt.name.match(/^role/))) {
                            plainTextCommand += " " + subopt.value;
                        }
                    }
                }
                break;
            case SPLAJINRO_COMMANDS.SendRoleOption:
                if (opt.type == ApplicationCommandOptionType.String && opt.name == "option") {
                    plainTextCommand += " " + opt.value;
                }
                break;
        }
    }

    return { plainTextCommand, mentionUsers };
};
