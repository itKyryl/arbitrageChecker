import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import IgnoreDomain from '../entities/live/IgnoreDomain';
import { IgnoreUseFor } from '../../types';

class IgnoreDomainController {
    private telegramIgnoreDomainRepository: Repository<IgnoreDomain>;

    constructor() {
        this.telegramIgnoreDomainRepository = AppDataSource.getRepository(IgnoreDomain);
    }

    public async getIgnoreDomainsByUseFor(useFor: IgnoreUseFor): Promise<IgnoreDomain[]> {
        
        return await this.telegramIgnoreDomainRepository.findBy({useFor});
    }

    public async addIgnoreDomain(data: Omit<IgnoreDomain, 'id' | 'createDate' | 'updateDate'>) {
        const newIgnoreDomain = new IgnoreDomain();

        newIgnoreDomain.useFor = data.useFor;
        newIgnoreDomain.description = data.description;
        newIgnoreDomain.domainName = data.domainName;

        this.telegramIgnoreDomainRepository.save(newIgnoreDomain);
    }

    public async getAllIgnoreDomains(): Promise<IgnoreDomain[]> {
        return await this.telegramIgnoreDomainRepository.find();
    }

    public async removeIgnoreDomainById(userIds: string[]): Promise<void> {
        const ignoreAccount: IgnoreDomain[] = [];

        for(let userId of userIds) {
            ignoreAccount.push(await this.getIgnoreDomainById(userId));
        }

        await this.telegramIgnoreDomainRepository.remove(ignoreAccount);
    }

    public async getIgnoreDomainById(id: string): Promise<IgnoreDomain> {
        const ignoreDomain = await this.telegramIgnoreDomainRepository.findOneBy({
            id
        });

        if(ignoreDomain) return ignoreDomain;
        else throw new Error(`Unable to find ignore domain with id ${id}`);
    }
}

export default new IgnoreDomainController();