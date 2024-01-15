import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import IgnoreAccount, {IgnoreAccountUseFor} from '../entities/live/IgnoreAccount';

class IgnoreAccountController {
    private telegramIgnoreAccountRepository: Repository<IgnoreAccount>;

    constructor() {
        this.telegramIgnoreAccountRepository = AppDataSource.getRepository(IgnoreAccount);
    }

    public async getIgnoreAccountsByUseFor(useFor: IgnoreAccountUseFor): Promise<IgnoreAccount[]> {
        
        return await this.telegramIgnoreAccountRepository.findBy({useFor});
    }

    public async addIgnoreAccount(data: Omit<IgnoreAccount, 'id' | 'createDate' | 'updateDate'>) {
        const newIgnoreAccount = new IgnoreAccount();

        newIgnoreAccount.useFor = data.useFor;
        newIgnoreAccount.accountType = data.accountType;
        newIgnoreAccount.accountId = data.accountId;

        this.telegramIgnoreAccountRepository.save(newIgnoreAccount);
    }

    public async getAllIgnoreAccounts(): Promise<IgnoreAccount[]> {
        return await this.telegramIgnoreAccountRepository.find();
    }

    public async removeIgnoreAccountById(userIds: string[]): Promise<void> {
        const ignoreAccount: IgnoreAccount[] = [];

        for(let userId of userIds) {
            ignoreAccount.push(await this.getIgnoreAccountById(userId));
        }

        await this.telegramIgnoreAccountRepository.remove(ignoreAccount);
    }

    public async getIgnoreAccountById(id: string): Promise<IgnoreAccount> {
        const user =  await this.telegramIgnoreAccountRepository.findOneBy({
            id
        });

        if(user) return user;
        else throw new Error(`Unable to find user with id ${id}`);
    }
}

export default new IgnoreAccountController();