import TelegramBot from "node-telegram-bot-api";
import { NewTelegramUser } from "../types";
import { Mode, UseFor } from "../db/entities/live/TelegramUser";
import TelegramUserController from "../db/controllers/TelegramUser.controller";
import { AccountType, IgnoreAccountUseFor } from "../db/entities/live/IgnoreAccount";

export const NEW_USER_PATTERN = `/add_user {"name": "YourName", "chatId": "111111111", "mode": "${Object.values(Mode).join('/')}", "useFor": "${Object.values(UseFor).join('/')}"}`;
export const REMOVE_USER_PATTERN = `/remove_users [user_id_1, user_id_2]`;
export const NEW_IGNORE_ACCOUNT_PATTERN = `/add_ignore_account { "accountId": "1111111", "accountType": "${Object.values(AccountType).join('/')}", "useFor": "${Object.values(IgnoreAccountUseFor).join('/')}"}`;
export const REMOVE_IGNORE_ACCOUNT_PATTERN = `/remove_ignore_accounts [ignore_account_id_1, ignore_account_id_2]`;

export function start(bot: TelegramBot) {
    return (msg: TelegramBot.Message) => {
        bot.sendMessage(msg.chat.id, `Options:
- /chat_id - give you your chat id.

- /add_user - add new user to telegram bot. \nExample: ${NEW_USER_PATTERN}.
- /all_users - show all users.
- /remove_users - remove user. \nExample: ${REMOVE_USER_PATTERN}.

- /all_ignore_accounts - show all ignore accounts.
- /add_ignore_account - add new ignore account. \nExample: ${NEW_IGNORE_ACCOUNT_PATTERN}.
- /remove_ignore_accounts - remove ignore accounts. \nExample: ${REMOVE_IGNORE_ACCOUNT_PATTERN}.
`);
    }
}

export function getCahtId(bot: TelegramBot) {
    return (msg: TelegramBot.Message) => {
        bot.sendMessage(msg.chat.id, `Your chat id: ${msg.chat.id}`);
    }
}