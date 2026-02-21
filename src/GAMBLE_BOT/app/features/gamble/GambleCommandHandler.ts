import { eCommands } from "../../Commands";
import { MyResult } from "../../core/messaging/MessageFactory";
import { CommandHandler, CommandHandlerContext } from "../CommandHandler";

type GambleActions = {
    gambleSync: (isDM: boolean, channelId: string, cmd: any) => Promise<MyResult>;
};

export class GambleCommandHandler implements CommandHandler {
    constructor(private readonly actions: GambleActions) {}

    canHandle(cmd: any): boolean {
        return cmd.command === eCommands.GambleSync;
    }

    handle(ctx: CommandHandlerContext): Promise<MyResult> {
        return this.actions.gambleSync(ctx.isDM, ctx.channelId, ctx.cmd);
    }
}
