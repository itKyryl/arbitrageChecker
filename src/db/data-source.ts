import { DataSource } from "typeorm";
import env from "../utils/env";
import path from 'path';

const NODE_ENV = env('NODE_ENV');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: env('POSTGRES_HOST'),
    port: Number.parseInt(env('POSTGRES_PORT')),
    username: env('POSTGRES_USERNAME'),
    password: env('POSTGRES_PASSWORD'),
    database: env('POSTGRES_DATABASE'),
    synchronize: false,
    logging: false, //NODE_ENV === 'development' ? true : false,
    entities: [getPathForDatasource('entities')],
    subscribers: [],
    migrations: [getPathForDatasource('migrations')],
    cache: true

})

export default AppDataSource;

/**
 * Init data source
 */
export async function postgresInit(): Promise<boolean> {
    try {
        await AppDataSource.initialize();
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 
 * @returns get path to typeorm dirs by type.
 */
function getPathForDatasource(type: 'entities' | 'migrations'): string {
    if(type === "entities") {
        return path.resolve(__dirname, type, 'live', '*.{ts,js}');
    } else return path.resolve(__dirname, type, '**', '*.{ts,js}');
}

/**
 * 
 * @param variable cash id
 * @param timeMs living time for cach in ms 
 * @returns generated cach object
 */
export function generateCach<CachVars>(variable: CachVars, timeMs: number) {
    return {
        id: variable,
        milliseconds: timeMs
    }
}

/**
 * 
 * @param variable cash id to remove
 */
export async function clearCach<CachVars>(variable: CachVars[]) {
    await AppDataSource.queryResultCache?.remove(variable as any[]);
}