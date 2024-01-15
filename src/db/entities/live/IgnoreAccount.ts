import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Base from '../abstract/Base';


export enum AccountType {
    FB = 'fb',
    TT = 'tt'
}

export enum IgnoreAccountUseFor {
    DOMAIN_CHECKING = 'domainChecking'
}

@Entity()
class IgnoreAccount {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({type: 'varchar', nullable: false})
    accountId: string;
    
    @Column({type: 'enum', nullable: false, enum: AccountType})
    accountType: AccountType;

    @Column({type: 'enum', enum: IgnoreAccountUseFor, nullable: false})
    useFor: IgnoreAccountUseFor
}

export default IgnoreAccount;