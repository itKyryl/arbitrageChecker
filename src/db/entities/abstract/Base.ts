import { PrimaryGeneratedColumn } from "typeorm";

export default abstract class Base {
    @PrimaryGeneratedColumn('increment')
    id: string;
}