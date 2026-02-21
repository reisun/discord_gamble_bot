import { GambleSyncMode } from "../../Model";
import { CommandParser } from "../../Commands";
import { ResultOK } from "../../Result";
import { eMessage } from "../../Const";
import { SyncSheetService } from "../../gamble/SyncSheet";
import { DBAccesser } from "../../db";
import { MessageFactory, MyResult } from "../../core/messaging/MessageFactory";

export class GambleFeatureService {
    constructor(private readonly db: DBAccesser) {}

    gambleSync = async (isDM: boolean, channelId: string, cmd: CommandParser): Promise<MyResult> => {
        if (isDM) {
            return MessageFactory.createErrorReply("/gb_sync はサーバーチャンネルから実行してください。");
        }

        const { status, value: session } = await this.db.asyncSelectGambleSessionForce(channelId);
        if (status != ResultOK) {
            return MessageFactory.createErrorReply(status);
        }

        const spreadsheetId = cmd.getValue(0, 1) ?? session.spreadsheetId;
        const sheetName = cmd.getValue(0, 2) ?? session.sheetName;
        const credentialRef = cmd.getValue(0, 3) ?? session.credentialRef;
        const mode = (cmd.getValue(0, 4) as GambleSyncMode | null) ?? "full";

        const updSuccess = await this.db.asyncUpdateGambleSession(channelId, {
            spreadsheetId,
            sheetName,
            credentialRef,
        });
        if (!updSuccess) {
            return MessageFactory.createErrorReply(eMessage.C00_DBError);
        }

        try {
            const syncSession = { ...session, spreadsheetId, sheetName, credentialRef };
            const result = await SyncSheetService.sync(syncSession, mode);
            return MessageFactory.createSuccessReply(
                `同期に成功しました。mode=${result.mode}\nusers_balance=${result.rows.users_balance}, bets=${result.rows.bets}, ledger=${result.rows.ledger}\nspreadsheetId=${spreadsheetId}`,
            );
        }
        catch (e) {
            return MessageFactory.createErrorReply(SyncSheetService.toDiscordErrorMessage(e));
        }
    }

    resolveGame = async (sessionId: string, gameId: string, winningTicket: string): Promise<MyResult> => {
        try {
            const { summary } = await this.db.asyncResolveGame(sessionId, gameId, winningTicket);
            const msg = [
                `ゲーム確定が完了しました。`,
                `- 総額: ${summary.totalStake}`,
                `- 当選口数: ${summary.winningBetCount}`,
                `- 最大払戻: ${summary.maxPayout}`,
            ].join("\n");
            return MessageFactory.createSuccessReply(msg);
        }
        catch (error) {
            const errMessage = error instanceof Error ? error.message : "ゲーム確定処理で不明なエラーが発生しました。";
            return MessageFactory.createErrorReply(errMessage);
        }
    }
}
