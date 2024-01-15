import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Settings {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column({type: 'boolean', nullable: false})
    stopWrongTextAd: boolean;
}

export default Settings;