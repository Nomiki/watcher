import { IRunner, YargsArgv } from '../interfaces/iRunner';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import {
    IConfiguration,
    IGenericConfiguration,
} from '../interfaces/iConfiguration';
import yargs from 'yargs';
import { FileWatcher } from '../core/fileWatcher';

@IRunner.register
export class GenericRunner implements IRunner {
    private process: ChildProcessWithoutNullStreams | undefined = undefined;
    public config: IGenericConfiguration | undefined;

    constructor() {}

    getConfiguration(): IConfiguration {
        return this.config || {};
    }

    registerYargsCommand(argv: yargs.Argv<{}>): yargs.Argv<{}> {
        return argv.command({
            command: 'generic',
            describe: 'watch generic app',
            builder: (y) => {
                return y
                    .option('extensions', {
                        alias: 'e',
                        describe: 'file extensions to watch',
                        required: true,
                        type: 'array',
                    })
                    .option('cmd', {
                        alias: 'c',
                        describe: 'cmd to run',
                        required: true,
                        type: 'string',
                    })
                    .option('args', {
                        alias: 'a',
                        describe: 'args divided by ","',
                        required: false,
                        type: 'string',
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
    createConfiguration(argv: YargsArgv): IGenericConfiguration {
        return {
            type: 'generic',
            extensionsToWatch: argv.extensions as string[],
            runConfig: {
                cmd: argv.cmd as string,
                args: (argv.args as string).split(','),
            },
        };
    }

    async run(): Promise<void> {
        console.log('running...');
        const cmd = this.config?.runConfig.cmd ?? '';
        const args = this.config?.runConfig.args;
        console.log(cmd, args);

        if (this.process) {
            console.log('killing previous process with pid', this.process.pid);
            this.process.kill();
        }

        if (!cmd) {
            return;
        }

        const process = spawn(cmd, args);
        console.log('started new process with pid', process.pid);
        process.stdout.on('data', (data: Buffer) =>
            console.log(data.toString('utf8'))
        );
        process.stderr.on('data', (data: Buffer) =>
            console.error('error', data.toString('utf8'))
        );
        process.on('close', (code) =>
            console.log(`process closed with exit code ${code}`)
        );

        this.process = process;
    }
}
