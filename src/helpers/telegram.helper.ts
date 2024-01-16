
import { Mode, UseFor } from "../db/entities/live/TelegramUser";
import { AccountType } from "../db/entities/live/IgnoreAccount";
import { Context } from "telegraf";
import { IgnoreUseFor } from "../types";

export const NEW_USER_PATTERN = `/add_user {"name": "YourName", "chatId": "111111111", "mode": "${Object.values(Mode).join('/')}", "useFor": "${Object.values(UseFor).join('/')}"}`;
export const REMOVE_USER_PATTERN = `/remove_users [user_id_1, user_id_2]`;
export const NEW_IGNORE_ACCOUNT_PATTERN = `/add_ignore_account { "accountId": "1111111", "accountType": "${Object.values(AccountType).join('/')}", "useFor": "${Object.values(IgnoreUseFor).join('/')}"}`;
export const REMOVE_IGNORE_ACCOUNT_PATTERN = `/remove_ignore_accounts [ignore_account_id_1, ignore_account_id_2]`;
export const NEW_IGNORE_DOMAIN_PATTERN = `/add_ignore_domain { "domainName": "domain.com", "description": "your_description", "useFor": "${Object.values(IgnoreUseFor).join('/')}"}`;
export const REMOVE_IGNORE_DOMAIN_PATTERN = `/remove_ignore_domain [ignore_domain_id_1, ignore_domain_id_2]`;

export enum Button {
    SHOW_ALL_IGNORE_ACCOUNTS = 'Show All Ignore Accounts',
    SHOW_ALL_IGNORE_DOMAINS = 'Show All Ignore Domains',
    SHOW_ALL_USERS = 'Show All Users',
    CLOSE = "Close Menu"
}

export function start(ctx: Context) {
    ctx.reply(`Options:
- /chat_id - give you your chat id.

- /add_user - add new user to telegram bot. \nExample: ${NEW_USER_PATTERN}.
- /all_users - show all users.
- /remove_users - remove user. \nExample: ${REMOVE_USER_PATTERN}.

- /all_ignore_accounts - show all ignore accounts.
- /add_ignore_account - add new ignore account. \nExample: ${NEW_IGNORE_ACCOUNT_PATTERN}.
- /remove_ignore_accounts - remove ignore accounts. \nExample: ${REMOVE_IGNORE_ACCOUNT_PATTERN}.
`);
    }

export function chatId(ctx: Context) {
    ctx.reply(`Your chat id: ${ctx.chat?.id}`);
}

export function menu(ctx: Context) {
    const chatId = ctx.chat?.id;
    if(chatId) {
        ctx.sendMessage('Select action', {
            reply_markup: {
                keyboard: [
                    [Button.SHOW_ALL_IGNORE_ACCOUNTS, Button.SHOW_ALL_USERS, Button.SHOW_ALL_USERS],
                    [Button.CLOSE]
                ]
            }
        })
    }
}

export function closeMenu(ctx: Context) {
    ctx.sendMessage('Menu Was Closed', {
        reply_markup: {
            remove_keyboard: true
        }
    })
}