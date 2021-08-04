import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { IRunner } from '../interfaces/iRunner';
import { DotnetCoreRunner } from '../runners/dotnetCoreRunner';
import { GenericRunner } from '../runners/genericRunner';

export class ArgFactory {
    private static yargsArgv: yargs.Argv<{}>;

    public static getYargs() {
        this.yargsArgv = yargs(hideBin(process.argv));
        const ctors = IRunner.getImplementations();
        for (const ctor of ctors) {
            const runner = new ctor();
            this.yargsArgv = runner.registerYargsCommand(this.yargsArgv);
        }
        return this.yargsArgv;
    }

    private static registerComponents() {
        new DotnetCoreRunner();
        new GenericRunner();
    }
}
