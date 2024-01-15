import TelegramBot from "node-telegram-bot-api";
import { TelegramBotOnTextRules } from '../types';
import { getCahtId as getChatId, start } from "../helpers/telegram.helper";
import { addUser, allUsers, removeUsers } from '../helpers/telegramUser.helper';
import { addIgnoreAccount, allIgnoreAccounts, removeIgnoreAccount } from '../helpers/telegramIgnoreAccount.helper';
import env from '../utils/env';
import splitText from '../utils/splitText';
import TelegramUser from "../db/entities/live/TelegramUser";

class Telegram {
    private bot: TelegramBot;

    constructor(token: string) {
        this.bot = new TelegramBot(token, {polling: true});
        this.onText();
    }

    private onText() {
        const rules: TelegramBotOnTextRules[] = [
            { regex: /\/chat_id/, function: getChatId(this.bot) },
            { regex: /\/start/, function: start(this.bot) },
            { regex: /\/add_user/, function: addUser(this.bot)},
            { regex: /\/all_users/, function: allUsers(this.bot)},
            { regex: /\/remove_users/, function: removeUsers(this.bot)},
            { regex: /\/add_ignore_account/, function: addIgnoreAccount(this.bot)},
            { regex: /\/all_ignore_accounts/, function: allIgnoreAccounts(this.bot)},
            { regex: /\/remove_ignore_account/, function: removeIgnoreAccount(this.bot)},
        ]

        rules.forEach(rule => {
            this.bot.onText(rule.regex, rule.function);
        })
    }

    public async sendMessage(chatId: string, message: string) {
        if(message.length > 4000) {
            const chunks = splitText(message, 4000);
            for(let chunk of chunks) {
                await this.bot.sendMessage(chatId, chunk);
            }
        } else {
            await this.bot.sendMessage(chatId, message);
        }
    }

    public async sendMessageToUsers(users: TelegramUser[], message: string) {
        for(let user of users) {
            await this.sendMessage(user.chatId, message);
        }
    }
}

export default new Telegram(env('NODE_ENV') === 'production' ? env('TELEGRAM_BOT_ARBITRAGE_TOKEN'): env('TELEGRAM_BOT_DEV_TOKEN'));