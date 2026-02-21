import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { TEAMBUILD_DEFAULT_NUM } from "../../Const";
import { eCommandOptions } from "./eCommandOptions";
import { CORE_COMMANDS } from "./eCommands";

export const CORE_COMMAND_JSONBODYS: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [
    new SlashCommandBuilder()
        .setName(CORE_COMMANDS.TeamBuilder)
        .setDescription("（スプラ人狼とは関係ない機能）メンバーを[Aチーム][Bチーム][観戦ほか]にチーム分けします。")
        .addIntegerOption(opt => opt
            .setName("count")
            .setDescription(`１チームの最大人数。指定無しなら ${TEAMBUILD_DEFAULT_NUM}人。`)
            .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(CORE_COMMANDS.MessageCopy)
        .setDescription("メッセージを他のチャンネルにコピーします。")
        .addSubcommand(subcmd => subcmd
            .setName(eCommandOptions.single)
            .setDescription("指定されたメッセージリンクのメッセージをコピーします。")
            .addChannelOption(opt => opt
                .setName('channel')
                .setDescription('コピー先のチャンネル名を入力してください。')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName("message_link")
                .setDescription("コピーしたいメッセージのリンクをメッセージの右クリックからコピペしてください。")
                .setRequired(true)
            )
        )
        .addSubcommand(subcmd => subcmd
            .setName(eCommandOptions.datetimeRange)
            .setDescription("指定された日時の範囲のメッセージをコピーします。")
            .addChannelOption(opt => opt
                .setName('channel')
                .setDescription('コピー先のチャンネル名を入力してください。')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName("from_ymd")
                .setDescription("開始日を YYYY-MM-DD 形式で入力してください")
                .setRequired(true)
            )
            .addStringOption(opt => opt
                .setName("from_hm")
                .setDescription("開始時刻を HH:MM 形式で入力してください")
                .setRequired(true)
            )
            .addStringOption(opt => opt
                .setName("to_ymd")
                .setDescription("終了日を YYYY-MM-DD 形式で入力してください")
                .setRequired(true)
            )
            .addStringOption(opt => opt
                .setName("to_hm")
                .setDescription("終了時刻を HH:MM 形式で入力してください")
                .setRequired(true)
            )
        )
        .toJSON(),
];
