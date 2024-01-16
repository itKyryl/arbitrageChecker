import { NewIgnoreDomain } from "../types";
import { NEW_IGNORE_ACCOUNT_PATTERN, NEW_IGNORE_DOMAIN_PATTERN, REMOVE_IGNORE_ACCOUNT_PATTERN, REMOVE_IGNORE_DOMAIN_PATTERN } from './telegram.helper';
import IgnoreAccountController from "../db/controllers/IgnoreAccount.controller";
import { Context } from "telegraf";
import IgnoreDomainController from "../db/controllers/IgnoreDomain.controller";

export async function addIgnoreDomain(ctx: Context, message: string) {
    if(message) {
        const regex = /(\{.*\})/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const userParams: NewIgnoreDomain = JSON.parse(execution[0]);
            
            try {
                await IgnoreDomainController.addIgnoreDomain({
                    ...userParams
                })
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n ${e.message}`);
            }

            ctx.reply(`Ignore domain ${userParams.domainName} succesfully added!`);
        } else {
            ctx.reply(`Unable to collect data for new ignore domain adding. Plese use this pattern ${NEW_IGNORE_DOMAIN_PATTERN}`);
        }
    }
}

export async function removeIgnoreDomains(ctx: Context, message: string) {
    if(message) {
        const regex = /(\[.*\])/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const ids: number[] = JSON.parse(execution[0]);
            try {
                await IgnoreDomainController.removeIgnoreDomainById(ids.map( id => id.toString()));
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n${e.message}`);
            }

            ctx.reply(`Ignore domain ${JSON.stringify(ids)} succesfully removed!`);
        } else {
            ctx.reply(`Unable to remove ignore domain. Plese use this pattern ${REMOVE_IGNORE_DOMAIN_PATTERN}`);
        }
    }
}

export async function allIgnoreDomains(ctx: Context) {
    const ignoreDomains = await IgnoreDomainController.getAllIgnoreDomains();

    const replyMessage = ignoreDomains.map(ignoreDomain => `${ignoreDomain.id} - ${ignoreDomain.domainName} - ${ignoreDomain.useFor} - ${ignoreDomain.description}`).join('\n');

    ctx.reply(replyMessage.length > 0 ? replyMessage : 'Empty');
}