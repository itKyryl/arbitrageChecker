import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IgnoreUseFor } from "../../../types";


export enum AccountType {
    FB = 'fb',
    TT = 'tt'
}

@Entity()
class IgnoreAccount {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({type: 'varchar', nullable: false})
    accountId: string;
    
    @Column({type: 'enum', nullable: false, enum: AccountType})
    accountType: AccountType;

    @Column({type: 'enum', enum: IgnoreUseFor, nullable: false})
    useFor: IgnoreUseFor
}

export default IgnoreAccount;