#!/usr/bin/env node

import { ArgFactory } from './core/argFactory';

setInterval(() => {}, 1 << 30);
process.on('SIGINT', (code) => {
    console.log('Process exited due to Ctrl + C');
    process.exit(1);
});

console.log('hello');
const yargs = ArgFactory.getYargs();
const argv = yargs.argv;
