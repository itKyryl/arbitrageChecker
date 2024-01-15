import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseTime from '../abstract/BaseTime';

export enum Mode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production'
}

export enum UseFor {
    TT_URL_CHECK = 'TT_URL_CHECK',
    TT_ACC_CHECK = 'TT_ACC_CHECK',
}

@Entity()
class TelegramUser {
    @PrimaryGeneratedColumn('increment')
    id: string;
    
    @Column({type: 'varchar', nullable: false})
    chatId: string;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'enum', enum: Mode, nullable: false})
    mode: Mode;

    @Column({type: 'enum', enum: UseFor, nullable: false})
    useFor: UseFor;
}

export default TelegramUser;