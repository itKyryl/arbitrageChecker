class Timer {
    private start: Date;

    constructor() {
        this.start = new Date();
    }

    public stop(message: string = '',title: string = 'Execution finished', displayDefaultInfo: boolean = true) {
        const curTime = new Date();
        const difference = new Date(curTime.getTime() - this.start.getTime());

        const hours = difference.getHours().toString().padStart(2, '0');
        const minutes = difference.getMinutes().toString().padStart(2, '0');
        const seconds = difference.getSeconds().toString().padStart(2, '0');
        const ms = difference.getMilliseconds().toString().padStart(3, '0');
        
        if(displayDefaultInfo) {
            const defaultMessage = `|${hours}h:${minutes}m:${seconds}s:${ms}ms|`;
            console.log(title.toUpperCase());
            console.log(''.padStart(defaultMessage.length, '-'));
            console.log(defaultMessage);
            console.log(''.padStart(defaultMessage.length, '-'));
        }

        if(message) console.log(message);
    }
}

export default Timer;