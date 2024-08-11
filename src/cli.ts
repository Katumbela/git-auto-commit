#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { argv } from 'process';

const targetDir = '.';

function getCommitType(status: string): string {
    if (status === 'A') return 'feat';
    if (status === 'M') return 'fix';
    if (status === 'D') return 'chore';
    return 'chore';
}


function generateMessageFromDiff(diff: string, file: string): string {
    const messages: string[] = [];

    // Detecção de adição de função
    if (/^\+?\s*function\s+(\w+)/.test(diff)) {
        const functionName = diff.match(/function\s+(\w+)/)?.[1];
        messages.push(`Criação da função ${functionName} em ${file}`);
    }

    // Detecção de criação de botão
    if (/^\+?\s*<button/.test(diff)) {
        messages.push(`Criação de um botão em ${file}`);
    }

    // Detecção de criação de imagem
    if (/^\+?\s*<img/.test(diff)) {
        messages.push(`Criação de uma imagem em ${file}`);
    }

    return messages.join('; ');
}


function run() {
    try {
        process.chdir(path.resolve(targetDir));

        let count = 1;
        let pushAfterCommit = false;

        const args = argv.slice(2);
        if (args.includes('--all') || args.includes('-a')) {
            console.log('📦 Comitando todos os arquivos de uma vez.');
            const allFiles = execSync('git status --porcelain').toString().trim().split('\n');
            allFiles.forEach(line => {
                const [status, file] = [line.slice(0, 2).trim(), line.slice(3)];
                const commitType = getCommitType(status);
                if (file) {
                    const diff = execSync(`git diff ${file}`).toString().trim();
                    const message = generateMessageFromDiff(diff, file);
                    console.log(`📁 Adicionando arquivo ${file}`);
                    execSync(`git add "${file}"`);
                    execSync(`git commit -m "${commitType}: count++} - ${file}. ${message}"`);
                    console.log(`✅ Arquivo ${file} commitado com sucesso.`);
                }
            });
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
                    // execSync(`git commit -m "feat: commit ${count++} - ${file}. Criação de novo arquivo"`);
                    execSync(`git commit -m "feat: ${file}. Criação de novo arquivo"`);
                    console.log(`✅ Ficheiro não rastreado commitado ${file}`);
                }
            });

            const modifiedFiles = execSync('git diff --name-only').toString().trim().split('\n');
            modifiedFiles.forEach(file => {
                if (file) {
                    const diff = execSync(`git diff ${file}`).toString().trim();
                    const message = generateMessageFromDiff(diff, file);
                    console.log(`📝 Adicionando ficheiro modificado ${file}`);
                    execSync(`git add "${file}"`);
                    //execSync(`git commit -m "fix: commit ${count++} - ${file}. ${message}"`);
                    execSync(`git commit -m "fix: ${file}. ${message}"`);
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
