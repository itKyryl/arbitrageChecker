import {Time} from '../types';

export function convertTimeToMs(time: Time) {
    time.hours = time.hours * 60 * 60 * 1000;
    time.minutes = time.minutes * 60 * 1000;
    time.seconds = time.seconds * 1000;
    return time.hours + time.minutes + time.seconds;
}