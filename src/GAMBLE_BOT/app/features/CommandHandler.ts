import { Interaction, TextBasedChannel, User } from "discord.js";
import { CommandParser } from "../Commands";
import { User as MyUser } from "../Model";
import { MyResult } from "../core/messaging/MessageFactory";

export type CommandHandlerContext = {
    cmd: CommandParser;
    user: User;
    channel: TextBasedChannel;
    mentionUsers: MyUser[];
    interaction?: Interaction;
    isDM: boolean;
    channelId: string;
    sender: MyUser;
};

export interface CommandHandler {
    canHandle(cmd: CommandParser): boolean;
    handle(ctx: CommandHandlerContext): Promise<MyResult>;
}
