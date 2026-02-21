import { MessageFlags, TextBasedChannel } from "discord.js";
import { eMessage } from "../../Const";
import { User as MyUser } from "../../Model";
import { MessageContent } from "../../DiscordUtils";
import { Utils } from "../../Utilis";

export const eSendType = {
    sendReply: 1,
    sendReplyByDM: 2,
    sendDMByUserId: 3,
    sendSameChannel: 4,
    sendOtherChannel: 5,
} as const;
export type eSendType = (typeof eSendType)[keyof typeof eSendType];

export type SendListItem = {
    type: eSendType,
    user: MyUser,
    sendMessage: MessageContent,
    targetChannel?: TextBasedChannel,
}

export type MyResult = {
    status: "success" | "error",
    sendList: SendListItem[]
}

export class MessageFactory {
    private static updateMessageContent(msg: eMessage | MessageContent, ...args: unknown[]) {
        if (typeof msg === "string") {
            msg = Utils.format(msg, ...args);
        }
        else if (msg.content) {
            msg.content = Utils.format(msg.content, ...args);
        }
        return msg;
    }

    static createReply = (msg: eMessage | MessageContent, ...args: unknown[]): SendListItem => ({
        type: eSendType.sendReply,
        user: { id: "", name: "" },
        sendMessage: MessageFactory.updateMessageContent(msg, ...args),
    });

    static createReplyDM = (msg: eMessage | MessageContent, ...args: unknown[]): SendListItem => ({
        type: eSendType.sendReplyByDM,
        user: { id: "", name: "" },
        sendMessage: MessageFactory.updateMessageContent(msg, ...args),
    });

    static createDMToOtherUser = (user: MyUser, msg: eMessage | MessageContent, ...args: unknown[]): SendListItem => ({
        type: eSendType.sendDMByUserId,
        user,
        sendMessage: MessageFactory.updateMessageContent(msg, ...args),
    });

    static createSendSameChannel = (msg: eMessage | MessageContent, ...args: unknown[]): SendListItem => ({
        type: eSendType.sendSameChannel,
        user: { id: "", name: "" },
        sendMessage: MessageFactory.updateMessageContent(msg, ...args),
    });

    static createSendOtherChannel = (ch: TextBasedChannel, msg: eMessage | MessageContent, ...args: unknown[]): SendListItem => ({
        type: eSendType.sendOtherChannel,
        user: { id: "", name: "" },
        sendMessage: MessageFactory.updateMessageContent(msg, ...args),
        targetChannel: ch,
    });

    static createErrorReply = (msg: eMessage | MessageContent, ...args: unknown[]): MyResult => {
        if (typeof msg === "string") {
            return {
                status: "error",
                sendList: [MessageFactory.createReply({ content: msg, flags: MessageFlags.SuppressNotifications }, ...args)],
            };
        }
        return {
            status: "error",
            sendList: [MessageFactory.createReply(msg, ...args)],
        };
    }

    static createSuccessReply = (msg: eMessage | MessageContent, ...args: unknown[]): MyResult => ({
        status: "success",
        sendList: [MessageFactory.createReply(msg, ...args)],
    });

    static createSuccessSendSameChannel = (msg: eMessage | MessageContent, ...args: unknown[]): MyResult => ({
        status: "success",
        sendList: [MessageFactory.createSendSameChannel(msg, ...args)],
    });

    static createSuccessSendOtherChannel = (ch: TextBasedChannel, msg: eMessage | MessageContent, ...args: unknown[]): MyResult => ({
        status: "success",
        sendList: [MessageFactory.createSendOtherChannel(ch, msg, ...args)],
    });
}
