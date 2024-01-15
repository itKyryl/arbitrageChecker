import checkTtAdsInterval from "./checkTtAds.interval";

export default function() {
    const intervals: Function[] = [checkTtAdsInterval];

    for(let interval of intervals) {
        interval();
    }
}