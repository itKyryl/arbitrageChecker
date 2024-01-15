import TelegramBot from "node-telegram-bot-api";
import { NewIgnoreAccount } from "../types";
import { NEW_IGNORE_ACCOUNT_PATTERN, REMOVE_IGNORE_ACCOUNT_PATTERN } from './telegram.helper';
import IgnoreAccountController from "../db/controllers/IgnoreAccount.controller";

export function addIgnoreAccount(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        if(msg.text) {
            const regex = /(\{.*\})/;
            
            const execution = regex.exec(msg.text);
            if(execution && execution.length > 0) {
                const userParams: NewIgnoreAccount = JSON.parse(execution[0]);
                
                try {
                    await IgnoreAccountController.addIgnoreAccount({
                        ...userParams
                    })
                } catch (e: any) {
                    bot.sendMessage(msg.chat.id, `Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n ${e.message}`);
                }

                bot.sendMessage(msg.chat.id, `Ignore account ${userParams.accountId} succesfully added!`);
            } else {
                bot.sendMessage(msg.chat.id, `Unable to collect data for new ignore account adding. Plese use this pattern ${NEW_IGNORE_ACCOUNT_PATTERN}`);
            }
        }
    }
}

export function removeIgnoreAccount(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        if(msg.text) {
            const regex = /(\[.*\])/;
            
            const execution = regex.exec(msg.text);
            if(execution && execution.length > 0) {
                const ids: number[] = JSON.parse(execution[0]);
                try {
                    await IgnoreAccountController.removeIgnoreAccountById(ids.map( id => id.toString()));
                } catch (e: any) {
                    bot.sendMessage(msg.chat.id, `Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n${e.message}`);
                }

                bot.sendMessage(msg.chat.id, `Ignore accounts ${JSON.stringify(ids)} succesfully removed!`);
            } else {
                bot.sendMessage(msg.chat.id, `Unable to remove ignore account. Plese use this pattern ${REMOVE_IGNORE_ACCOUNT_PATTERN}`);
            }
        }
    }
}

export function allIgnoreAccounts(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        const ignoreAccounts = await IgnoreAccountController.getAllIgnoreAccounts();

        const message = ignoreAccounts.map(ignoreAccount => `${ignoreAccount.id} - ${ignoreAccount.accountId} - ${ignoreAccount.accountType} - ${ignoreAccount.useFor}`).join('\n');

        bot.sendMessage(msg.chat.id, message.length > 0 ? message : 'Empty');
    }
}