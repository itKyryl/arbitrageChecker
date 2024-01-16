import TelegramBot from "node-telegram-bot-api";
import { NewIgnoreAccount } from "../types";
import { NEW_IGNORE_ACCOUNT_PATTERN, REMOVE_IGNORE_ACCOUNT_PATTERN } from './telegram.helper';
import IgnoreAccountController from "../db/controllers/IgnoreAccount.controller";
import { Context } from "telegraf";

export async function addIgnoreAccount(ctx: Context, message: string) {
    if(message) {
        const regex = /(\{.*\})/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const userParams: NewIgnoreAccount = JSON.parse(execution[0]);
            
            try {
                await IgnoreAccountController.addIgnoreAccount({
                    ...userParams
                })
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n ${e.message}`);
            }

            ctx.reply(`Ignore account ${userParams.accountId} succesfully added!`);
        } else {
            ctx.reply(`Unable to collect data for new ignore account adding. Plese use this pattern ${NEW_IGNORE_ACCOUNT_PATTERN}`);
        }
    }
}

export async function removeIgnoreAccount(ctx: Context, message: string) {
    if(message) {
        const regex = /(\[.*\])/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const ids: number[] = JSON.parse(execution[0]);
            try {
                await IgnoreAccountController.removeIgnoreAccountById(ids.map( id => id.toString()));
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n${e.message}`);
            }

            ctx.reply(`Ignore accounts ${JSON.stringify(ids)} succesfully removed!`);
        } else {
            ctx.reply(`Unable to remove ignore account. Plese use this pattern ${REMOVE_IGNORE_ACCOUNT_PATTERN}`);
        }
    }
}

export async function allIgnoreAccounts(ctx: Context, message: string) {
    const ignoreAccounts = await IgnoreAccountController.getAllIgnoreAccounts();

    const replyMessage = ignoreAccounts.map(ignoreAccount => `${ignoreAccount.id} - ${ignoreAccount.accountId} - ${ignoreAccount.accountType} - ${ignoreAccount.useFor}`).join('\n');

    ctx.reply(replyMessage.length > 0 ? replyMessage : 'Empty');
}