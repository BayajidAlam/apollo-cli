import { Command } from 'commander';
import { execSync } from 'child_process';
import chalk from 'chalk';

export const prismaCommand = new Command('prisma')
    .description('Prisma utility commands')
    .argument('<action>', 'Action to perform (generate, migrate)')
    .action(async (action) => {
        try {
            if (action === 'generate') {
                console.log(chalk.blue('🔄 Generating Prisma Client...'));
                execSync('npx prisma generate', { stdio: 'inherit' });
                console.log(chalk.green('✅ Prisma Client generated!'));
            } else if (action === 'migrate') {
                console.log(chalk.blue('🔄 Running Migrations...'));
                execSync('npx prisma migrate dev', { stdio: 'inherit' });
                console.log(chalk.green('✅ Migrations applied!'));
            } else {
                console.error(chalk.red(`Unknown action: ${action}`));
                console.log('Available actions: generate, migrate');
            }

        } catch (error) {
            // Error is already logged by inherit stdio usually, but we catch to prevent crash dump
            console.error(chalk.red('❌ Prisma command failed.'));
            process.exit(1);
        }
    });
