import { Telegraf } from "telegraf";
import env from "../utils/env";
import nodeEnv from "../utils/nodeEnv";
import { TelegrafBotOnTextRule } from "../types";
import { chatId, start, menu, Button, closeMenu } from "../helpers/telegram.helper";
import splitText from "../utils/splitText";
import TelegramUser from "../db/entities/live/TelegramUser";
import { allIgnoreAccounts } from "../helpers/telegramIgnoreAccount.helper";
import { addUser, allUsers, removeUsers } from "../helpers/telegramUser.helper";
import { addIgnoreDomain, allIgnoreDomains, removeIgnoreDomains } from '../helpers/telegramIgnoreDomain.helper';

class Telegram {
    private bot: Telegraf;

    constructor(apiToken: string) {
        this.bot = new Telegraf(apiToken);
        this.launch();
    }

    private launch() {
        const rules: TelegrafBotOnTextRule[] = [
            { text: '/start', function: start },
            { text: '/chat_id', function: chatId },
            { text: '/menu', function: menu},
            { text: Button.SHOW_ALL_USERS, function: allUsers},
            { text: '/add_user', function: addUser},
            { text: '/remove_users', function: removeUsers},
            { text: Button.SHOW_ALL_IGNORE_ACCOUNTS, function: allIgnoreAccounts},
            { text: '/add_ignore_account', function: addIgnoreDomain},
            { text: '/remove_ignore_accounts', function: removeIgnoreDomains},
            { text: Button.SHOW_ALL_IGNORE_DOMAINS, function: allIgnoreDomains},
            { text: '/add_ignore_domain', function: addIgnoreDomain},
            { text: '/remove_ignore_domains', function: removeIgnoreDomains},
            { text: Button.CLOSE, function: closeMenu},
        ]

        this.bot.on('text', (ctx) => {
            const message = ctx.message.text;

            for(let rule of rules) {
                if(message.includes(rule.text)) {
                    rule.function(ctx, message);
                }
            }
        })
        this.bot.launch();
    }

    public sendMessage(chatId: string, message: string) {
        if(message.length > 4000) {
            const chunks = splitText(message, 4000);
            for(let chunk of chunks) {
                this.bot.telegram.sendMessage(chatId, chunk);
            }
        } else {
            this.bot.telegram.sendMessage(chatId, message);
        }
    }

    public sendMessageToUsers(users: TelegramUser[], message: string) {
        for(let user of users) {
            this.sendMessage(user.chatId, message);
        }
    }
}

export default new Telegram(nodeEnv() === 'production' ? env('TELEGRAM_BOT_ARBITRAGE_TOKEN'): env('TELEGRAM_BOT_DEV_TOKEN'));