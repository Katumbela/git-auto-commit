#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';

const targetDir = '.';

function run() {
    try {
        process.chdir(path.resolve(targetDir));

        let count = 1;

        const untrackedFiles = execSync('git ls-files --others --exclude-standard').toString().trim().split('\n');
        untrackedFiles.forEach(file => {
            if (file) {
                console.log(`📁  Adicionando ficheiros nao rastreados ${file}`);
                execSync(`git add "${file}"`);
                execSync(`git commit -m "commit ${count++} - ${file}"`);
                console.log(`✅ Ficheiro nao rastreados commitados ${file}`);
            }
        });

        const modifiedFiles = execSync('git diff --name-only').toString().trim().split('\n');
        modifiedFiles.forEach(file => {
            if (file) {
                console.log(`📝 Adicionando ficheiros modificados ${file}`);
                execSync(`git add "${file}"`);
                execSync(`git commit -m "commit ${count++} - ${file}"`);
                console.log(`✅ Ficheiros modificados Commitados ${file}`);
            }
        });
    } catch (error) {
        console.error('Erro ao executar seus commits:', (error as Error).message);
    }
}

run();
