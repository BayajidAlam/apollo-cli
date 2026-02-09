#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from '../commands/generate';
import { buildCommand } from '../commands/build';
import { prismaCommand } from '../commands/prisma';
import { initCommand } from '../commands/init';

const program = new Command();

program
    .version('1.0.0')
    .description('Apollo CLI Tool');

program.addCommand(generateCommand);
program.addCommand(buildCommand);
program.addCommand(prismaCommand);
program.addCommand(initCommand);

program.parse(process.argv);
