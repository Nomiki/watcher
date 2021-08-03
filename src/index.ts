#!/usr/bin/env node

import EventEmitter from 'events';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FileWatcher } from './core/fileWatcher';
import { DotnetCoreRunner } from './dotnetcore/dotnetCoreRunner';

setInterval(() => {}, 1 << 30);
process.on('SIGINT', (code) => {
    console.log('Process exited due to Ctrl + C');
    process.exit(1);
});

console.log('hello');

// const argv = yargs(hideBin(process.argv)).command(
//     'watch',
//     'watch the file changes'
// );

// argv.showHelp();

const dirName = 'd:\\/dev/Playground/Sample';
const dotnetRunner = new DotnetCoreRunner();
const fw = new FileWatcher(dirName, dotnetRunner);
fw.watch();
