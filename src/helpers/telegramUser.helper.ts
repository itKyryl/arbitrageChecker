import { NewTelegramUser } from "../types";
import TelegramUserController from '../db/controllers/TelegramUser.controller';
import { NEW_USER_PATTERN, REMOVE_USER_PATTERN } from './telegram.helper';
import { Context } from "telegraf";

export async function addUser(ctx: Context, message: string) {
    if(message) {
        const regex = /(\{.*\})/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const userParams: NewTelegramUser = JSON.parse(execution[0]);
            if(userParams.chatId === 'this') userParams.chatId = ctx.chat?.id.toString() as string;
            
            try {
                await TelegramUserController.addUser({
                    ...userParams
                })
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n ${e.message}`);
            }

            ctx.reply(`User ${userParams.name} succesfully added!`);
        } else {
            ctx.reply(`Unable to collect data for new user adding. Plese use this pattern ${NEW_USER_PATTERN}`);
        }
    }
}

export async function removeUsers(ctx: Context, message: string) {
    if(message) {
        const regex = /(\[.*\])/;
        
        const execution = regex.exec(message);
        if(execution && execution.length > 0) {
            const ids: number[] = JSON.parse(execution[0]);
            try {
                await TelegramUserController.removeUsersById(ids.map( id => id.toString()));
            } catch (e: any) {
                ctx.reply(`Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n${e.message}`);
            }

            ctx.reply(`Users ${JSON.stringify(ids)} succesfully removed!`);
        } else {
            ctx.reply(`Unable to remove users. Plese use this pattern ${REMOVE_USER_PATTERN}`);
        }
    }
}

export async function allUsers(ctx: Context, message: string) {
    const users = await TelegramUserController.getAllUsers();
    const replayMessage = users.map(user => `${user.id} - ${user.name} - ${user.mode} - ${user.useFor} - ${user.chatId}`).join('\n');

    ctx.reply(replayMessage.length > 0 ? replayMessage : 'Empty');
}