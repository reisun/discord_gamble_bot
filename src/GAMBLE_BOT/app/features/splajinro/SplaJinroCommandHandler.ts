import { Channel, Client, Interaction, User } from "discord.js";
import { eCommands, CommandParser } from "../../Commands";
import { User as MyUser } from "../../Model";
import { MyResult } from "../../core/messaging/MessageFactory";
import { CommandHandler, CommandHandlerContext } from "../CommandHandler";

type SplaJinroActions = {
    updateMember: (isDM: boolean, channelId: string, ch: Channel, sender: MyUser, cmd: CommandParser, inputMenbers: MyUser[]) => Promise<MyResult>;
    suggestRole: (isDM: boolean, channelId: string, ch: Channel, sender: MyUser, orgCmd: CommandParser) => Promise<MyResult>;
    sendRole: (isDM: boolean, client: Client, sender: MyUser, cmd: CommandParser, isSenderRoleChecked: boolean) => Promise<MyResult>;
    createVote: (isDM: boolean, channelId: string, ch: Channel, sender: MyUser, user: User) => Promise<MyResult>;
    ejectMemberForVote: (isDM: boolean, channelId: string, ch: Channel, sender: MyUser, cmd: CommandParser, inputMenbers: MyUser[]) => Promise<MyResult>;
    updateSendRoleOption: (isDM: boolean, channelId: string, cmd: CommandParser) => Promise<MyResult>;
    clearData: (isDM: boolean, channelId: string) => Promise<MyResult>;
    buildTeam: (isDM: boolean, channelId: string, ch: Channel, sender: MyUser, cmd: CommandParser) => Promise<MyResult>;
    messageCopy: (isDM: boolean, client: Client, ch: Channel, sender: MyUser, cmd: CommandParser, interaction?: Interaction) => Promise<MyResult>;
};

export class SplaJinroCommandHandler implements CommandHandler {
    constructor(private readonly actions: SplaJinroActions) {}

    canHandle(cmd: CommandParser): boolean {
        switch (cmd.command) {
            case eCommands.Member:
            case eCommands.SuggestRole:
            case eCommands.SendRole:
            case eCommands.CreateVote:
            case eCommands.EjectFromVote:
            case eCommands.SendRoleOption:
            case eCommands.ClearMemberData:
            case eCommands.TeamBuilder:
            case eCommands.MessageCopy:
                return true;
            default:
                return false;
        }
    }

    handle(ctx: CommandHandlerContext): Promise<MyResult> {
        switch (ctx.cmd.command) {
            case eCommands.Member:
                return this.actions.updateMember(ctx.isDM, ctx.channelId, ctx.channel as Channel, ctx.sender, ctx.cmd, ctx.mentionUsers);
            case eCommands.SuggestRole:
                return this.actions.suggestRole(ctx.isDM, ctx.channelId, ctx.channel as Channel, ctx.sender, ctx.cmd);
            case eCommands.SendRole:
                return this.actions.sendRole(ctx.isDM, ctx.channel.client, ctx.sender, ctx.cmd, true);
            case eCommands.CreateVote:
                return this.actions.createVote(ctx.isDM, ctx.channelId, ctx.channel as Channel, ctx.sender, ctx.user);
            case eCommands.EjectFromVote:
                return this.actions.ejectMemberForVote(ctx.isDM, ctx.channelId, ctx.channel as Channel, ctx.sender, ctx.cmd, ctx.mentionUsers);
            case eCommands.SendRoleOption:
                return this.actions.updateSendRoleOption(ctx.isDM, ctx.channelId, ctx.cmd);
            case eCommands.ClearMemberData:
                return this.actions.clearData(ctx.isDM, ctx.channelId);
            case eCommands.TeamBuilder:
                return this.actions.buildTeam(ctx.isDM, ctx.channelId, ctx.channel as Channel, ctx.sender, ctx.cmd);
            case eCommands.MessageCopy:
                return this.actions.messageCopy(ctx.isDM, ctx.channel.client, ctx.channel as Channel, ctx.sender, ctx.cmd, ctx.interaction);
            default:
                return Promise.resolve({ status: "success", sendList: [] });
        }
    }
}
