import { CallbackFunction, IRunner } from '../interfaces/iRunner';
import glob from 'glob';
import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export class DotnetCoreRunner implements IRunner {
    private csprojFiles: string[] = [];
    private projectExtension = 'csproj';
    private process: ChildProcessWithoutNullStreams | undefined = undefined;

    readonly extensionsToWatch = ['cs', 'csproj', 'sln'];

    constructor() {}

    run(): void {
        console.log('running...');
        const cmd = `dotnet`;
        const args = ['run', '--project', `${this.csprojFiles[1]}`];
        console.log(cmd, args);

        if (this.process) {
            console.log('killing previous process with pid', this.process.pid);
            this.process.kill();
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

    find(dirName: string, callback: CallbackFunction): void {
        const searchPath = path.normalize(
            dirName + '/**/*.' + this.projectExtension
        );
        console.log(searchPath);
        glob(searchPath, (err, files) => {
            if (!err && files && files.length > 0) {
                console.log(`found files ${files}`);
                this.csprojFiles = files.map((f) => path.normalize(f));
                callback(true);
                return;
            }

            callback(false);
        });
    }
}
