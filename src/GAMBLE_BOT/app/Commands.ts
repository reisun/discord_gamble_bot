import {
    Client,
    Interaction,
} from "discord.js";
import "./DiscordExtentions";
import { MemberRoleInfo, User as MyUser } from "./Model";
import { parseCoreInteraction } from "./commands/core/interactionParser";
import { eCommandOptions as commandOptions } from "./commands/core/eCommandOptions";
import { eCommands as commandNames, isMyCommand } from "./commands/core/eCommands";
import { CORE_COMMAND_JSONBODYS } from "./commands/core/commandJsonBodys";
import { SPLAJINRO_COMMAND_JSONBODYS } from "./commands/splajinro/commandJsonBodys";
import { GAMBLE_COMMAND_JSONBODYS } from "./commands/gamble/commandJsonBodys";
import { parseSplajinroInteraction } from "./commands/splajinro/interactionParser";
import { parseGambleInteraction } from "./commands/gamble/interactionParser";

export const eCommands = commandNames;
export const eCommandOptions = commandOptions;
export { isMyCommand };
export type eCommands = (typeof commandNames)[keyof typeof commandNames];
export type eCommandOptions = (typeof commandOptions)[keyof typeof commandOptions];

const SUPPORT_OPTION_LIST = [
    { command: eCommands.SuggestRole, opts: [eCommandOptions.nocheck] },
    { command: eCommands.Member, opts: [eCommandOptions.show, eCommandOptions.add, eCommandOptions.delete] },
    { command: eCommands.EjectFromVote, opts: [eCommandOptions.show, eCommandOptions.add, eCommandOptions.delete] },
    { command: eCommands.MessageCopy, opts: [eCommandOptions.single, eCommandOptions.datetimeRange] },
];

export const COMMAND_JSONBODYS_CORE = CORE_COMMAND_JSONBODYS;
export const COMMAND_JSONBODYS_SPLAJINRO = SPLAJINRO_COMMAND_JSONBODYS;
export const COMMAND_JSONBODYS_GAMBLE = GAMBLE_COMMAND_JSONBODYS;
export const COMMAND_JSONBODYS = [
    ...COMMAND_JSONBODYS_CORE,
    ...COMMAND_JSONBODYS_SPLAJINRO,
    ...COMMAND_JSONBODYS_GAMBLE,
];

/**
 * コマンドパーサ
 */
export class CommandParser {
    private _value: string[][];
    private _options: string[];
    private constructor(public orgString: string) {
        this._value = orgString.split("\n").map(elm =>
            // 半角 or 全角 のスペースがパラメータの区切りとする
            elm.split(/[ 　]+/)
        );
        this._options = [];

        // オプションがある場合は、オプションと値を分離する
        if (SUPPORT_OPTION_LIST.some(v => v.command == this.command)) {
            const opts = SUPPORT_OPTION_LIST.filter(v => v.command == this.command)[0].opts;
            const ret = CommandParser.separatOptionsAndValues(this._value, opts);
            this._options = ret.options;
            this._value = ret.values;
        }
    }

    /**
     * 平文のコマンドをパース
     * @param command 
     * @returns 
     */
    static fromPlaneText = (command: string): CommandParser => {
        return new CommandParser(command);
    }

    /**
     * インタラクションのコマンド（=スラッシュコマンド）をパース
     * @param client 
     * @param interaction 
     * @returns 
     */
    static asyncFromInteraction = async (client: Client, interaction: Interaction): Promise<{
        parsedCommand: CommandParser,
        mentionUsers: MyUser[]
    }> => {
        let plainTextCommand = "";
        let mentionUsers: MyUser[] = [];

        if (!interaction.isChatInputCommand()) {
            return { parsedCommand: new CommandParser(""), mentionUsers: mentionUsers };
        }

        if (!isMyCommand(interaction.commandName)) {
            return { parsedCommand: new CommandParser(""), mentionUsers: mentionUsers };
        }

        plainTextCommand = "/" + interaction.commandName;

        if (Object.values(eCommands).includes(interaction.commandName)) {
            const splaParsed = await parseSplajinroInteraction(client, interaction, plainTextCommand, mentionUsers);
            plainTextCommand = splaParsed.plainTextCommand;
            mentionUsers = splaParsed.mentionUsers;

            plainTextCommand = parseCoreInteraction(client, interaction, plainTextCommand);
            plainTextCommand = parseGambleInteraction(client, interaction, plainTextCommand);
        }

        return { parsedCommand: new CommandParser(plainTextCommand), mentionUsers: mentionUsers };
    }

    get command(): eCommands | null {
        const v = this.getValue(0, 0)?.replace(/^\//, "");
        return isMyCommand(v) ? v : null;
    }
    getValue(rowIdx: number, itemIdx: number): string | null {
        return this._value.at(rowIdx)?.at(itemIdx) ?? null;
    }
    existsOption(opt: eCommandOptions): boolean {
        return this._options.includes(opt);
    }
    isEmpty(): boolean {
        return this.orgString ? false : true;
    }
    /**
     * 指定した行に格納された要素の数を返却します。
     * @warning
     * コマンドが空かどうか確認する場合は isEmpty() を使用してください。
     * ⇒ コマンド文字列が空でも１行目のLengthは 0 ではなく 1 になるため（空文字が１番目の要素に入る）
     * @param rowIdx 
     * @returns 
     */
    getLength(rowIdx: number): number {
        return this._value.at(rowIdx)?.length ?? 0;
    }

    getLineNum(): number {
        return this._value.length;
    }

    parseMemberRoleSetting = (memberList: MyUser[]): MemberRoleInfo[] => {
        const cmd = this;

        // メンバー情報
        let memberRoleInfoList: MemberRoleInfo[] = [];
        for (let i = 1; i < cmd.getLineNum(); i++) {
            // メンバー情報は３つの要素
            if (cmd.getLength(i) != 3)
                continue;

            const theName = <string>cmd.getValue(i, 0);
            const role = <string>cmd.getValue(i, 1);
            const nameInCmd = <string>cmd.getValue(i, 2);
            const mem = memberList.find(m => m.name == nameInCmd);
            if (!mem)
                continue;

            memberRoleInfoList.push({
                id: mem.id,
                alphabet: theName.trim().slice(-1),
                name: mem.name,
                theName: theName,
                role: role,
            });
        }

        return memberRoleInfoList;
    }

    private static separatOptionsAndValues(
        values: string[][],
        opts: string[]
    ): { options: string[], values: string[][] } {

        if (values.length <= 0) {
            return { options: [], values: [] };
        }

        const isOption = (val: string) => opts.some(o => o == val);

        // ややこしくなるので、オプションは１行目に限ることにする。
        let options = values[0]
            .filter(val => isOption(val))
            .map(v => v);

        // コピー オプション以外を抽出
        let newValues: string[][] = values.map(row => row.filter(val => !isOption(val)).map(vv => vv));

        return { options: options, values: newValues };
    }
}
