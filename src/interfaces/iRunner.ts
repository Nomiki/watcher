export type CallbackFunction = (found: boolean) => void;

export interface IRunner {
    readonly extensionsToWatch: string[];
    run(): void;
    find(dirName: string, callback: CallbackFunction): void;
}
