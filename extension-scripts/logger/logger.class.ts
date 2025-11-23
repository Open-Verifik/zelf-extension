import { environment } from "../environments/environment";

export class Logger {
    private static readonly PREFIX = "[ZELF]:";
    private static readonly isEnabled = environment.enableLogging ?? false;
    private static readonly includeStack = environment.includeStackInLogs ?? false;

    private static getStack(): string | null {
        try {
            const stack = new Error().stack;

            if (!stack) return null;

            const stackLines = stack.split("\n");

            const relevantStack = stackLines.slice(4).filter((line) => {
                const trimmed = line.trim();

                return !trimmed.includes("logger.class.ts") && !trimmed.includes("Logger.");
            });

            return relevantStack.length > 0 ? relevantStack.join("\n") : null;
        } catch {
            return null;
        }
    }

    private static getCallerInfo(): { file: string; line: number; column: number } | null {
        try {
            const stack = new Error().stack;
            if (!stack) return null;

            const stackLines = stack.split("\n");
            // Stack trace format:
            // 0: Error
            // 1: getCallerInfo
            // 2: logWithCaller
            // 3: log/error/warn/etc (the Logger method)
            // 4: The actual caller (what we want)
            for (let i = 4; i < stackLines.length; i++) {
                const line = stackLines[i].trim();

                // Skip Logger class methods
                if (line.includes("logger.class.ts") || line.includes("Logger.")) continue;

                // Match: at functionName (file:line:column) or at file:line:column
                const match = line.match(/at\s+(?:.+?\s+)?\((.+?):(\d+):(\d+)\)/) || line.match(/at\s+(.+?):(\d+):(\d+)/);

                if (!match) continue;

                const filePath = match[1];
                const lineNumber = parseInt(match[2], 10);
                const columnNumber = parseInt(match[3], 10);
                const fileName = filePath.split("/").pop() || filePath.split("\\").pop() || filePath;

                return { file: fileName, line: lineNumber, column: columnNumber };
            }
        } catch {}

        return null;
    }

    private static logWithCaller(consoleMethod: typeof console.log, ...args: any[]): void {
        if (!this.isEnabled) return;

        const callerInfo = this.getCallerInfo();
        const stack = this.includeStack ? this.getStack() : null;

        if (callerInfo) {
            // Include caller info in the log message
            // Chrome DevTools will still show logger.class.ts, but the message will show the actual caller
            const logArgs: any[] = [
                `%c${this.PREFIX}%c [${callerInfo.file}:${callerInfo.line}]`,
                "font-weight: bold; color: #4CAF50",
                "font-weight: normal; color: #666; font-size: 0.9em",
                ...args,
            ];

            if (stack) logArgs.push(`\n${stack}`);

            consoleMethod(...logArgs);
        } else {
            const logArgs: any[] = [this.PREFIX, ...args];

            if (stack) logArgs.push(`\n${stack}`);

            consoleMethod(...logArgs);
        }
    }

    public static log(...args: any[]): void {
        this.logWithCaller(console.log, ...args);
    }

    public static error(...args: any[]): void {
        this.logWithCaller(console.error, ...args);
    }

    public static warn(...args: any[]): void {
        this.logWithCaller(console.warn, ...args);
    }

    public static info(...args: any[]): void {
        this.logWithCaller(console.info, ...args);
    }

    public static debug(...args: any[]): void {
        this.logWithCaller(console.debug, ...args);
    }

    public static trace(...args: any[]): void {
        if (!this.isEnabled) return;

        const callerInfo = this.getCallerInfo();
        const stack = this.includeStack ? this.getStack() : null;

        if (callerInfo) {
            const logArgs: any[] = [
                `%c${this.PREFIX}%c [${callerInfo.file}:${callerInfo.line}]`,
                "font-weight: bold; color: #4CAF50",
                "font-weight: normal; color: #666; font-size: 0.9em",
                ...args,
            ];

            // Add stack trace if enabled (console.trace already shows stack, but we can add formatted version)
            if (stack) {
                logArgs.push("\n%cStack trace:", "font-weight: bold; color: #999; font-size: 0.85em");
                logArgs.push(`%c${stack}`, "color: #999; font-size: 0.85em; font-family: monospace");
            }

            console.trace(...logArgs);
        } else {
            const logArgs: any[] = [this.PREFIX, ...args];

            if (stack) {
                logArgs.push("\n%cStack trace:", "font-weight: bold; color: #999; font-size: 0.85em");
                logArgs.push(`%c${stack}`, "color: #999; font-size: 0.85em; font-family: monospace");
            }

            console.trace(...logArgs);
        }
    }
}
