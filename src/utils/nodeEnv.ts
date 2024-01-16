import env from './env';
import { NodeEnv, nodeEnvArray } from '../types';

export default function (): NodeEnv {
    const nodeEnv = env('NODE_ENV');

    if(nodeEnvArray.includes(nodeEnv as NodeEnv)) {
        return nodeEnv as NodeEnv;
    } else {
        throw new Error(`Please set up NODE_ENV environment variable. Should be one of ${nodeEnvArray.join('/')}. Current: ${nodeEnv}`);
    }

}