#!/usr/bin/env node
import { Command } from 'commander';
import { generateCommand } from '../commands/generate';
import { buildCommand } from '../commands/build';
import { prismaCommand } from '../commands/prisma';
import { initCommand } from '../commands/init';

const program = new Command();

import fs from 'fs';
import path from 'path';

const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

program
    .version(packageJson.version)
    .description('Apollo CLI Tool');

program.addCommand(generateCommand);
program.addCommand(buildCommand);
program.addCommand(prismaCommand);
program.addCommand(initCommand);

program.parse(process.argv);
