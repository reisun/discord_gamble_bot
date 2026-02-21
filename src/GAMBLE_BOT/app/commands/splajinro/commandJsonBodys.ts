import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { Utils } from "../../Utilis";
import { eCommandOptions } from "../core/eCommandOptions";
import { SPLAJINRO_COMMANDS } from "./eCommands";

export const SPLAJINRO_COMMAND_JSONBODYS: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [
    new SlashCommandBuilder()
        .setName(SPLAJINRO_COMMANDS.Member)
        .setDescription("人狼参加メンバーの追加、削除、参照ができます。")
        .addStringOption(opt => opt
            .setName("option")
            .setDescription("実施する操作を指定します。")
            .setChoices(
                { name: "メンバーの追加", value: eCommandOptions.add },
                { name: "メンバーの削除", value: eCommandOptions.delete },
                { name: "確認のみ", value: eCommandOptions.show },
            )
            .setRequired(true)
        )
        .forEach(Utils.range(1, 9), (build, i) => build
            .addUserOption(opt => opt
                .setName("user" + i)
                .setDescription("追加する（または削除する）ユーザー。未指定の場合は確認のみになります。")
                .setRequired(false)
            )
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(SPLAJINRO_COMMANDS.SuggestRole)
        .setDescription("名前・役職の割り振りリストを作成できます。")
        .addSubcommand(subcmd => subcmd
            .setName("again")
            .setDescription("前回と同じ条件で割り振りリストを作成できます。\n（このコマンドめんどくさいもんね）")
        )
        .addSubcommand(subcmd => subcmd
            .setName("create")
            .setDescription("指定された内容で参加者に名前・役職を割り振りリストを作成します。")
            .addStringOption(opt => opt
                .setName("name")
                .setDescription("人狼の際のみんなに付ける共通の名前")
                .setRequired(true)
            )
            .forEach(Utils.range(1, 9), (build, i) => build
                .addStringOption(opt => opt
                    .setName("role" + i)
                    .setDescription("村人以外の役職の名前")
                    .setRequired(i == 1)
                )
            )
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(SPLAJINRO_COMMANDS.CreateVote)
        .setDescription("前回メンバーに知らせた役職を元に、投票フォームを作成します。")
        .toJSON(),
    new SlashCommandBuilder()
        .setName(SPLAJINRO_COMMANDS.EjectFromVote)
        .setDescription("指定したメンバーを次回の投票から除きます。")
        .addStringOption(opt => opt
            .setName("option")
            .setDescription("実施する操作を指定します。")
            .setChoices(
                { name: "除外メンバーの追加", value: eCommandOptions.add },
                { name: "除外の取り消し", value: eCommandOptions.delete },
                { name: "確認のみ", value: eCommandOptions.show },
            )
            .setRequired(true)
        )
        .forEach(Utils.range(1, 9), (build, i) => build
            .addUserOption(opt => opt
                .setName("user" + i)
                .setDescription("除外する（または除外を取り消す）ユーザー。未指定の場合は確認のみになります。")
                .setRequired(false)
            )
        )
        .toJSON(),
];
