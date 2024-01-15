import { ENV } from "../types";
import dotenv from 'dotenv';

dotenv.config();

export default function (key: keyof ENV): string {
    const value = process.env[key];

    if(value) return value;
    else throw new Error(`Plese add ${key} environment variable.`);
}