import chalk from 'chalk';
import { execSync } from 'child_process';
import { Command } from 'commander';

export const prismaCommand = new Command('prisma')
  .description('Prisma utility commands')
  .argument('<action>', 'Action to perform (generate, migrate)')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ apollo-cli prisma generate')}
  ${chalk.cyan('$ apollo-cli prisma migrate')}
`
  )
  .action(async (action) => {
    try {
      if (action === 'generate') {
        // Run Prisma generate
        console.log(chalk.blue('\n🔄 Generating Prisma Client...\n'));
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Prisma Client generated! ✨\n'));
      } else if (action === 'migrate') {
        // Run Prisma migrate dev
        console.log(chalk.blue('\n🔄 Running Migrations...\n'));
        execSync('npx prisma migrate dev', { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Migrations applied! ✨\n'));
      } else {
        console.error(chalk.red(`\n❌ Unknown action: ${chalk.bold(action)}`));
        console.log('Available actions: generate, migrate\n');
      }
    } catch (error) {
      // Error is already logged by inherit stdio usually, but we catch to prevent crash dump
      console.error(chalk.red('\n❌ Prisma command failed.\n'));
      process.exit(1);
    }
  });
