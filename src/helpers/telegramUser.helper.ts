import TelegramBot from "node-telegram-bot-api";
import { NewTelegramUser } from "../types";
import TelegramUserController from '../db/controllers/TelegramUser.controller';
import { NEW_USER_PATTERN, REMOVE_USER_PATTERN } from './telegram.helper';

export function addUser(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        if(msg.text) {
            const regex = /(\{.*\})/;
            
            const execution = regex.exec(msg.text);
            if(execution && execution.length > 0) {
                const userParams: NewTelegramUser = JSON.parse(execution[0]);
                if(userParams.chatId === 'this') userParams.chatId = msg.chat.id.toString();
                
                try {
                    await TelegramUserController.addUser({
                        ...userParams
                    })
                } catch (e: any) {
                    bot.sendMessage(msg.chat.id, `Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n ${e.message}`);
                }

                bot.sendMessage(msg.chat.id, `User ${userParams.name} succesfully added!`);
            } else {
                bot.sendMessage(msg.chat.id, `Unable to collect data for new user adding. Plese use this pattern ${NEW_USER_PATTERN}`);
            }
        }
    }
}

export function removeUsers(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        if(msg.text) {
            const regex = /(\[.*\])/;
            
            const execution = regex.exec(msg.text);
            if(execution && execution.length > 0) {
                const ids: number[] = JSON.parse(execution[0]);
                try {
                    await TelegramUserController.removeUsersById(ids.map( id => id.toString()));
                } catch (e: any) {
                    bot.sendMessage(msg.chat.id, `Server Error. Plese pass this message to administrator @kirHelp. Thank you! \n${e.message}`);
                }

                bot.sendMessage(msg.chat.id, `Users ${JSON.stringify(ids)} succesfully removed!`);
            } else {
                bot.sendMessage(msg.chat.id, `Unable to remove users. Plese use this pattern ${REMOVE_USER_PATTERN}`);
            }
        }
    }
}

export function allUsers(bot: TelegramBot) {
    return async (msg: TelegramBot.Message) => {
        const users = await TelegramUserController.getAllUsers();
        const message = users.map(user => `${user.id} - ${user.name} - ${user.mode} - ${user.useFor} - ${user.chatId}`).join('\n');

        bot.sendMessage(msg.chat.id, message.length > 0 ? message : 'Empty');
    }
}