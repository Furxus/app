export default class Logger {
    constructor(public readonly name: string) {
        this.name = name;
    }

    debug(...args: any[]) {
        console.debug(
            `%c${new Date().toLocaleTimeString()} | ${this.name} | DEBUG |`,
            `color: LimeGreen`,
            ...args
        );
    }

    info(...args: any[]) {
        console.info(
            `%c${new Date().toLocaleTimeString()} | ${this.name} | INFO |`,
            `color: DodgerBlue`,
            ...args
        );
    }

    warn(...args: any[]) {
        console.warn(
            `%c${new Date().toLocaleTimeString()} | ${this.name} | WARN |`,
            `color: Tomato`,
            ...args
        );
    }

    error(...args: any[]) {
        console.error(
            `%c${new Date().toLocaleTimeString()} | ${this.name} | ERROR |`,
            `color: Red`,
            ...args
        );
    }
}
