import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export const buildCommand = new Command('build')
    .description('Build the application for production')
    .action(async () => {
        console.log(chalk.blue('🚀 Starting build process...'));

        try {
            // 1. Clean dist folder
            const distPath = path.join(process.cwd(), 'dist');
            if (fs.existsSync(distPath)) {
                console.log(chalk.yellow('🧹 Cleaning dist folder...'));
                await fs.remove(distPath);
            }

            // 2. Run TypeScript Compiler
            console.log(chalk.blue('🔨 Compiling TypeScript...'));
            execSync('npx tsc', { stdio: 'inherit' });

            // 3. Copy Key Files
            console.log(chalk.blue('📂 Copying static files...'));
            const filesToCopy = ['package.json', 'package-lock.json', '.env'];

            for (const file of filesToCopy) {
                const srcPath = path.join(process.cwd(), file);
                if (fs.existsSync(srcPath)) {
                    await fs.copy(srcPath, path.join(distPath, file));
                }
            }

            console.log(chalk.green('\n✅ Build completed successfully!'));
            console.log(chalk.white('To deploy, upload the "dist" folder and run:'));
            console.log(chalk.cyan('npm install --production'));

        } catch (error) {
            console.error(chalk.red('❌ Build failed:'), error);
            process.exit(1);
        }
    });
