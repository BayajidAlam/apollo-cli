#!/usr/bin/env node
import { Command } from 'commander';
import { buildCommand } from '../commands/build';
import { generateCommand } from '../commands/generate';
import { initCommand } from '../commands/init';
import { prismaCommand } from '../commands/prisma';

// Set up the main CLI program
const program = new Command();

import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';

// Read package.json to get version and description
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

program
  .version(packageJson.version)
  .description('Apollo CLI Tool')
  .addHelpText(
    'beforeAll',
    chalk.cyan(figlet.textSync('Apollo CLI', { horizontalLayout: 'full' })) +
      '\n'
  )
  .configureHelp({
    subcommandTerm: (cmd) => chalk.magenta.bold(cmd.name()),
    subcommandDescription: (cmd) => chalk.white(cmd.description()),
    optionTerm: (option) => chalk.green(option.flags),
    optionDescription: (option) => chalk.white(option.description),
    commandUsage: (cmd) => chalk.yellow(cmd.usage()),
    commandDescription: (cmd) => chalk.blue(cmd.description()),
  })
  .addHelpText(
    'after',
    `
${chalk.yellow('Global Examples:')}
  ${chalk.cyan('$ apollo-cli init my-project')}
  ${chalk.cyan('$ apollo-cli generate module user')}
  ${chalk.cyan('$ apollo-cli prisma migrate')}
  ${chalk.cyan('$ apollo-cli build')}
`
  );

// Register available commands
program.addCommand(generateCommand);
program.addCommand(buildCommand);
program.addCommand(prismaCommand);
program.addCommand(initCommand);

// Parse command line arguments
program.parse(process.argv);
