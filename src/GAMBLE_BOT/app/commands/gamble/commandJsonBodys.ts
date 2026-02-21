import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { GAMBLE_COMMANDS } from "./eCommands";

export const GAMBLE_COMMAND_JSONBODYS: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GambleSync)
        .setDescription("ギャンブルデータをGoogleスプレッドシートへ同期します。")
        .addStringOption(opt => opt
            .setName("spreadsheet_id")
            .setDescription("GoogleスプレッドシートID。初回は必須。")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("sheet_name")
            .setDescription("同期設定名。運用管理用の任意文字列。")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("credential_ref")
            .setDescription("アクセストークンを保持する環境変数名。")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("mode")
            .setDescription("同期方式(full=フル再生成, incremental=増分)")
            .setChoices(
                { name: "full", value: "full" },
                { name: "incremental", value: "incremental" },
            )
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbOpen)
        .setDescription("ギャンブルを開幕します。初期ポイント、GMパスワード、同期先を設定します。")
        .addIntegerOption(opt => opt
            .setName("initial_point")
            .setDescription("参加者の初期ポイント")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("gm_password")
            .setDescription("GM操作用のパスワード")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("sync_to")
            .setDescription("同期先ID（チャンネルIDや任意の識別子）")
            .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbGame)
        .setDescription("ゲームの開始・締切を切り替えます。")
        .addStringOption(opt => opt
            .setName("action")
            .setDescription("実施する操作")
            .setChoices(
                { name: "開始", value: "start" },
                { name: "締切", value: "close" },
            )
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("game_id")
            .setDescription("対象ゲームID")
            .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbBet)
        .setDescription("ベットします（A案のみ公開中: ticket文字列のみ対応。B/C案は将来拡張）。")
        .addStringOption(opt => opt
            .setName("game_id")
            .setDescription("対象ゲームID")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("ticket")
            .setDescription("A案: ticket文字列（例: 1-2-3）。B/Cは将来拡張予定")
            .setRequired(true)
        )
        .addIntegerOption(opt => opt
            .setName("point")
            .setDescription("賭けるポイント")
            .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbResult)
        .setDescription("ゲーム結果を登録します（winningTicketはA案 ticket文字列）。")
        .addStringOption(opt => opt
            .setName("game_id")
            .setDescription("対象ゲームID")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("winning_ticket")
            .setDescription("当選ticket（例: 1-2-3）")
            .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbSync)
        .setDescription("ギャンブル情報を同期します。")
        .addStringOption(opt => opt
            .setName("sync_to")
            .setDescription("同期先ID（未指定なら既定値）")
            .setRequired(false)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName(GAMBLE_COMMANDS.GbConfig)
        .setDescription("GMパスワードまたは同期先を変更します。")
        .addStringOption(opt => opt
            .setName("gm_password")
            .setDescription("新しいGMパスワード")
            .setRequired(false)
        )
        .addStringOption(opt => opt
            .setName("sync_to")
            .setDescription("新しい同期先ID")
            .setRequired(false)
        )
        .toJSON(),
];
