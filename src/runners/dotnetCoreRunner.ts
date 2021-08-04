import { IRunner, YargsArgv } from '../interfaces/iRunner';
import glob from 'glob';
import path from 'path';
import {
    IConfiguration,
    IDotnetConfiguration,
    IGenericConfiguration,
} from '../interfaces/iConfiguration';
import { GenericRunner } from './genericRunner';
import yargs from 'yargs';
import { FileWatcher } from '../core/fileWatcher';

@IRunner.register
export class DotnetCoreRunner implements IRunner {
    private projectExtension = 'csproj';
    private genericRunner: GenericRunner | undefined;
    private config: IDotnetConfiguration | undefined;

    constructor() {}

    getConfiguration(): IConfiguration {
        return this.config ?? {};
    }

    async run(): Promise<void> {
        await this.ensureConfig();

        if (!this.genericRunner) {
            const genericConfig: IGenericConfiguration = {
                extensionsToWatch: this.config?.extensionsToWatch,
                runConfig: {
                    cmd: 'dotnet',
                    args: [
                        'run',
                        '--project',
                        this.config?.runConfig?.csprojFile ?? '',
                    ],
                },
                type: this.config?.type,
            };

            this.genericRunner = new GenericRunner();
            this.genericRunner.config = genericConfig;
        }

        await this.genericRunner.run();
    }

    private async ensureConfig() {
        if (!this.config?.runConfig?.csprojFile) {
            const csprojFiles = await this.findCsprojFiles();
            if (!this.config) {
                this.config = {};
            }

            if (!this.config?.runConfig) {
                this.config.runConfig = {};
            }

            if (csprojFiles && csprojFiles.length > 0) {
                this.config.runConfig.csprojFile = csprojFiles[0];
            }
        }
    }

    registerYargsCommand(argv: yargs.Argv<{}>): yargs.Argv<{}> {
        return argv.command({
            command: 'dotnetcore',
            describe: 'watch dotnet core app',
            builder: (y) => {
                return y.option('csproj', {
                    alias: 'p',
                    describe: 'csproj file',
                    required: true,
                });
            },
            handler: (argv) => {
                this.config = this.createConfiguration(argv);
                const fileWatcher = new FileWatcher(
                    process.cwd(),
                    this.config,
                    this
                );
                fileWatcher.watch();
            },
        });
    }

    createConfiguration(argv: YargsArgv): IDotnetConfiguration {
        return {
            type: 'dotnetcore',
            extensionsToWatch: ['cs', 'csproj', 'sln'],
            runConfig: {
                csprojFile: argv.csproj as string,
            },
        };
    }

    async findCsprojFiles(): Promise<string[]> {
        const searchPath = path.normalize(
            process.cwd() + '/**/*.' + this.projectExtension
        );
        console.log(searchPath);
        return await new Promise((resolve, reject) => {
            glob(searchPath, (err, files) =>
                err === null ? resolve(files) : reject(err)
            );
        });
    }
}
