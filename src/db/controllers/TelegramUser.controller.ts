import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import TelegramUser, { Mode, UseFor } from '../entities/live/TelegramUser';
import env from '../../utils/env';

class TelegramUserController {
    private telegramUserRepository: Repository<TelegramUser>;

    constructor() {
        this.telegramUserRepository = AppDataSource.getRepository(TelegramUser);
    }

    public async getUsersByUseFor(useFor: UseFor): Promise<TelegramUser[]> {
        const mode: Mode = env('NODE_ENV') === 'development' ? Mode.DEVELOPMENT : Mode.PRODUCTION;
        
        return await this.telegramUserRepository.findBy({mode, useFor});
    }

    public async addUser(data: Omit<TelegramUser, 'id' | 'createDate' | 'updateDate'>) {
        const newTelegramUser = new TelegramUser();

        newTelegramUser.chatId = data.chatId;
        newTelegramUser.mode = data.mode;
        newTelegramUser.name = data.name;
        newTelegramUser.useFor = data.useFor;

        this.telegramUserRepository.save(newTelegramUser);
    }

    public async getAllUsers(): Promise<TelegramUser[]> {
        return await this.telegramUserRepository.find();
    }

    public async removeUsersById(userIds: string[]): Promise<void> {
        const users: TelegramUser[] = [];

        for(let userId of userIds) {
            users.push(await this.getUserById(userId));
        }

        await this.telegramUserRepository.remove(users);
    }

    public async getUserById(id: string): Promise<TelegramUser> {
        const user =  await this.telegramUserRepository.findOneBy({
            id
        });

        if(user) return user;
        else throw new Error(`Unable to find user with id ${id}`);
    }
}

export default new TelegramUserController();