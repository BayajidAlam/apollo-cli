import chalk from 'chalk';
import { execSync } from 'child_process';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

export const buildCommand = new Command('build')
  .description('Build the application for production')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ apollo-cli build')}
`
  )
  .action(async () => {
    console.log(chalk.blue('\n🚀 Starting build process...\n'));

    try {
      // Clean up the dist folder before starting a fresh build
      const distPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distPath)) {
        console.log(chalk.yellow('🧹 Cleaning dist folder...\n'));
        await fs.remove(distPath);
      }

      // Compile the TypeScript code using the local tsc binary
      console.log(chalk.blue('🔨 Compiling TypeScript...\n'));
      execSync('npx tsc', { stdio: 'inherit' });

      // Copy essential files like package.json and .env to the dist folder
      console.log(chalk.blue('\n📂 Copying static files...\n'));
      const filesToCopy = ['package.json', 'package-lock.json', '.env'];

      for (const file of filesToCopy) {
        const srcPath = path.join(process.cwd(), file);
        if (fs.existsSync(srcPath)) {
          await fs.copy(srcPath, path.join(distPath, file));
        }
      }

      console.log(chalk.green('\n✅ Build completed successfully! ✨\n'));
      console.log(chalk.white('To deploy, upload the "dist" folder and run:'));
      console.log(chalk.cyan('npm install --production\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ Build failed:'), error);
      process.exit(1);
    }
  });
