import { Column, Entity } from "typeorm";
import Base from "../abstract/Base";
import { IgnoreUseFor } from "../../../types";

@Entity()
class IgnoreDomain extends Base {
    @Column({type: 'varchar', nullable: false})
    domainName: string;

    @Column({type: 'varchar', nullable: false})
    description: string;

    @Column({type: 'enum', enum: IgnoreUseFor, nullable: false})
    useFor: IgnoreUseFor;
}

export default IgnoreDomain;