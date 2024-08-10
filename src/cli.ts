#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { argv } from 'process';

const targetDir = '.';

function run() {
    try {
        process.chdir(path.resolve(targetDir));

        let count = 1;
        let pushAfterCommit = false;
 
        const args = argv.slice(2);
        if (args.includes('--all') || args.includes('-a')) {
            console.log('📦 Comitando todos os arquivos de uma vez.');
            const allFiles = execSync('git ls-files --others --exclude-standard -o -m').toString().trim().split('\n');
            allFiles.forEach(file => {
                if (file) {
                    console.log(`📁 Adicionando arquivo ${file}`);
                    execSync(`git add "${file}"`);
                }
            });
            execSync(`git commit -m "commit ${count++} - All files"`);
            console.log('✅ Todos os arquivos foram commitados.');
        } else {
            
            if (args.includes('--push') || args.includes('-p')) {
                pushAfterCommit = true;
            }
 
            const untrackedFiles = execSync('git ls-files --others --exclude-standard').toString().trim().split('\n');
            untrackedFiles.forEach(file => {
                if (file) {
                    console.log(`📁 Adicionando ficheiro não rastreado ${file}`);
                    execSync(`git add "${file}"`);
                    execSync(`git commit -m "commit ${count++} - ${file}"`);
                    console.log(`✅ Ficheiro não rastreado commitado ${file}`);
                }
            });
 
            const modifiedFiles = execSync('git diff --name-only').toString().trim().split('\n');
            modifiedFiles.forEach(file => {
                if (file) {
                    console.log(`📝 Adicionando ficheiro modificado ${file}`);
                    execSync(`git add "${file}"`);
                    execSync(`git commit -m "commit ${count++} - ${file}"`);
                    console.log(`✅ Ficheiro modificado commitado ${file}`);
                }
            });
 
            if (pushAfterCommit) {
                console.log('🚀 Enviando alterações para o repositório remoto.');
                execSync('git push');
                console.log('✅ Alterações enviadas com sucesso.');
            }
        }
    } catch (error) {
        console.error('Erro ao executar seus commits:', (error as Error).message);
    }
}

run();
