#!/usr/bin/env node

import { ArgFactory } from './core/argFactory';
import { FileWatcher } from './core/fileWatcher';
import { IRunner } from './interfaces/iRunner';

setInterval(() => {}, 1 << 30);
process.on('SIGINT', (code) => {
    console.log('Process exited due to Ctrl + C');
    process.exit(1);
});

console.log('hello');
const yargs = ArgFactory.getYargs();
if (yargs.argv) {
} else {
    yargs.showHelp();
    process.exit(-1);
}
