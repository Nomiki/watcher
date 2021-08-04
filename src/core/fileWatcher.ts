import chokidar from 'chokidar';
import { IConfiguration } from '../interfaces/iConfiguration';
import { IRunner } from '../interfaces/iRunner';

export interface IFileWatcher {
    watch(): void;
    isWatchableFile(file: string): boolean;
}

export class FileWatcher implements IFileWatcher {
    private isReady: boolean = false;

    constructor(
        private dirName: string,
        private configuration: IConfiguration,
        private runner: IRunner
    ) {
        this.runner = runner;
        this.configuration = runner?.getConfiguration() || this.configuration;
        this.isReady = true;
    }

    watch(): void {
        console.log('System started watching files...');
        const watcher = chokidar.watch(this.dirName, {
            ignored: /^\./,
            persistent: true,
            ignoreInitial: true,
        });

        watcher
            .on('add', (path) => this.onFileAdded(path))
            .on('change', (path) => this.onFileChanged(path))
            .on('unlink', (path) => this.onFileRemoved(path));
    }

    isWatchableFile(file: string): boolean {
        const fileLowerCase = file.toLowerCase();
        const isWatchable =
            this.configuration.extensionsToWatch?.some((x) =>
                fileLowerCase.endsWith(`.${x}`)
            ) || false;

        return isWatchable;
    }

    private onFileAdded(path: string): void {
        console.log(`file ${path} added`);
        this.runRunnerIfNeeded(path);
    }

    private onFileChanged(path: string): void {
        console.log(`file ${path} changed`);
        this.runRunnerIfNeeded(path);
    }

    private onFileRemoved(path: any) {
        console.log(`file ${path} removed`);
        this.runRunnerIfNeeded(path);
    }

    private runRunnerIfNeeded(path: string) {
        if (this.isReady && this.isWatchableFile(path)) {
            console.log(`file ${path} is also watchable!`);
            this.runner?.run();
        }
    }
}
