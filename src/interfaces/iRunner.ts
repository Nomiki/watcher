import yargs from 'yargs';
import { IConfiguration } from './iConfiguration';

export type YargsArgv = {
    [argName: string]: unknown;
    _: (string | number)[];
    $0: string;
};

export interface IRunner {
    run(): Promise<void>;
    getConfiguration(): IConfiguration;
    registerYargsCommand(argv: yargs.Argv<{}>): yargs.Argv<{}>;
}

export namespace IRunner {
    type Constructor<T> = {
        new (...args: any[]): T;
        readonly prototype: T;
    };
    const implementations: Constructor<IRunner>[] = [];
    export function getImplementations(): Constructor<IRunner>[] {
        return implementations;
    }
    export function register<T extends Constructor<IRunner>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }
}
