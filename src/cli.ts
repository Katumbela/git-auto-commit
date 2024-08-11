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
    if (/function\s+(\w+)/.test(diff)) {
        const functionName = diff.match(/function\s+(\w+)/)?.[1];
        return `Criação da função ${functionName}`;
    }
    if (/<button/.test(diff)) {
        return `Criação de um botão no arquivo ${file}`;
    }
    if (/<img/.test(diff)) {
        return `Criação de uma imagem no arquivo ${file}`;
    }
    if (/background-color|color|font-size/.test(diff)) {
        return `Estilização de CSS no arquivo ${file}`;
    }
    if (/^\s*\/\/\s/.test(diff)) {
        return `Adição de um comentário no arquivo ${file}`;
    }
    if (/console\.log/.test(diff)) {
        return `Adição de log no console no arquivo ${file}`;
    }
    if (/\+\s*import/.test(diff)) {
        return `Adição de importação no arquivo ${file}`;
    }
    if (/document\.querySelector|document\.getElementById/.test(diff)) {
        return `Manipulação de DOM no arquivo ${file}`;
    }
    if (/\+/.test(diff) && !/-/.test(diff)) {
        return `Adição de código no arquivo ${file}`;
    }
    if (/-/.test(diff) && !/\+/.test(diff)) {
        return `Remoção de código no arquivo ${file}`;
    }
    if (/\+/.test(diff) && /-/.test(diff)) {
        return `Modificação de código no arquivo ${file}`;
    }
    if (/^\s+$/.test(diff)) {
        return `Alteração de espaço ou linhas em branco no arquivo ${file}`;
    }
    if (/text/.test(diff)) {
        return `Alteração de texto no arquivo ${file}`;
    }
    if (/const\s+\w+\s*=/.test(diff)) {
        return `Criação de uma constante no arquivo ${file}`;
    }
    if (/let\s+\w+\s*=|var\s+\w+\s*=/.test(diff)) {
        return `Criação de uma variável no arquivo ${file}`;
    }
    if (/React\.Component|function\s+\w+\(.*\)\s*{/.test(diff)) {
        return `Alteração em componente React no arquivo ${file}`;
    }
    if (/^import\s+\w+/.test(diff)) {
        return `Adição de novo import no arquivo ${file}`;
    }
    if (/>\s*\w+.*<\/\w+>/.test(diff)) {
        return `Mudança de texto em um elemento HTML no arquivo ${file}`;
    }
    if (/^\s*(public|private|protected)?\s*\w+\s*\(.*\)\s*{/.test(diff)) {
        return `Criação de um novo método de classe no arquivo ${file}`;
    }
    if (/style=\{[^}]+\}/.test(diff)) {
        return `Adição de um novo estilo inline no arquivo ${file}`;
    }
    if (status === 'A') {
        return `Criação de um novo arquivo ${file}`;
    }
    if (/^-/.test(diff)) {
        return `Remoção de linhas de código no arquivo ${file}`;
    }
    if (/^<\w+/.test(diff)) {
        return `Criação de um novo elemento HTML no arquivo ${file}`;
    }
    if (/^mv\s+/.test(diff)) {
        return `Mudança na estrutura de pastas no arquivo ${file}`;
    }
    if (/addEventListener|onClick|onChange/.test(diff)) {
        return `Alteração em funções de manipulação de eventos no arquivo ${file}`;
    }
    if (/\w+\s*=\s*\[.*\]|\w+\s*=\s*{.*}/.test(diff)) {
        return `Alteração de conteúdo em um array ou objeto no arquivo ${file}`;
    }
    if (/describe\(|it\(|test\(/.test(diff)) {
        return `Criação de testes unitários no arquivo ${file}`;
    }





    return `Alterações gerais ou refatoração no arquivo ${file}`;
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
                    execSync(`git commit -m "${commitType}: ${file}. ${message}"`);
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
