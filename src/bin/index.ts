#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from '../commands/generate';

const program = new Command();

program
    .version('1.0.0')
    .description('Apollo Gears CLI Tool');

program.addCommand(generateCommand);

program.parse(process.argv);
