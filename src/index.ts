import 'reflect-metadata';
import intervalsRunner from './intervals/intervalsRunner';
import server from './server';
import { postgresInit } from './db/data-source';

const main = async () => {
    const dbInitialised = await postgresInit();

    if(dbInitialised) {
        intervalsRunner()
        server();
    } else {
        console.log(`Database was not initialised. Unable to launch other processes!`);
    }
}

main();
