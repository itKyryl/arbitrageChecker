import {  CreateDateColumn, UpdateDateColumn } from "typeorm";
import Base from "./Base";

export default abstract class BaseTime extends Base {
    @UpdateDateColumn({type: 'timestamp'})
    updateDate: Date;

    @CreateDateColumn({type: 'timestamp'})
    createDate: Date;
}