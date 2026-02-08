#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from '../commands/generate';
import { buildCommand } from '../commands/build';
import { prismaCommand } from '../commands/prisma';

const program = new Command();

program
    .version('1.0.0')
    .description('Apollo Gears CLI Tool');

program.addCommand(generateCommand);
program.addCommand(buildCommand);
program.addCommand(prismaCommand);

program.parse(process.argv);
