#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { argv } from 'process';

const targetDir = '.';

function getCommitType(status: string): string {
    if (status === 'A') return 'feat';
    if (status === 'M') return 'fix';
    if (status === 'D') return 'chore';
    if (status === 'U') return 'chore';
    return 'chore';
}

function generateMessageFromDiff(diff: string, file: string): string {
    const messages: string[] = [];

    // Detecção de adição de função
    if (/function\s+(\w+)/.test(diff)) {
        const functionName = diff.match(/function\s+(\w+)/)?.[1];
        messages.push(`Criação da função ${functionName} no arquivo ${file}`);
    }

    // Detecção de criação de botão
    if (/<button/.test(diff)) {
        messages.push(`Criação de um botão no arquivo ${file}`);
    }

    // Detecção de criação de imagem
    if (/<img/.test(diff)) {
        messages.push(`Criação de uma imagem no arquivo ${file}`);
    }

    // Detecção de estilização CSS
    if (/background-color|color|font-size/.test(diff)) {
        messages.push(`Estilização de CSS no arquivo ${file}`);
    }

    // Detecção de adição de comentário
    if (/^\s*\/\/\s/.test(diff)) {
        messages.push(`Adição de um comentário no arquivo ${file}`);
    }

    // Detecção de adição de log no console
    if (/console\.log/.test(diff)) {
        messages.push(`Adição de log no console no arquivo ${file}`);
    }

    // Detecção de adição de importação
    if (/^\+\s*import/.test(diff)) {
        messages.push(`Adição de importação no arquivo ${file}`);
    }

    // Detecção de manipulação de DOM
    if (/document\.querySelector|document\.getElementById/.test(diff)) {
        messages.push(`Manipulação de DOM no arquivo ${file}`);
    }

    // Detecção de adição ou remoção de código
    if (/^\+/.test(diff) && !/-/.test(diff)) {
        messages.push(`Adição de código no arquivo ${file}`);
    }
    if (/-/.test(diff) && !/\+/.test(diff)) {
        messages.push(`Remoção de código no arquivo ${file}`);
    }
    if (/^\+/.test(diff) && /-/.test(diff)) {
        messages.push(`Modificação de código no arquivo ${file}`);
    }

    // Detecção de alteração de espaços ou linhas em branco
    if (/^\s+$/.test(diff)) {
        messages.push(`Alteração de espaço ou linhas em branco no arquivo ${file}`);
    }

    // Detecção de alteração de texto
    if (/text/.test(diff)) {
        messages.push(`Alteração de texto no arquivo ${file}`);
    }

    // Detecção de criação de constante ou variável
    if (/const\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma constante no arquivo ${file}`);
    }
    if (/let\s+\w+\s*=|var\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma variável no arquivo ${file}`);
    }

    // Detecção de alteração em componente React
    if (/React\.Component|function\s+\w+\(.*\)\s*{/.test(diff)) {
        messages.push(`Alteração em componente React no arquivo ${file}`);
    }

    // Detecção de adição de novo import
    if (/^import\s+\w+/.test(diff)) {
        messages.push(`Adição de novo import no arquivo ${file}`);
    }

    // Detecção de mudança de texto em elemento HTML
    if (/>\s*\w+.*<\/\w+>/.test(diff)) {
        messages.push(`Mudança de texto em um elemento HTML no arquivo ${file}`);
    }

    // Detecção de criação de novo método de classe
    if (/^\s*(public|private|protected)?\s*\w+\s*\(.*\)\s*{/.test(diff)) {
        messages.push(`Criação de um novo método de classe no arquivo ${file}`);
    }

    // Detecção de adição de estilo inline
    if (/style=\{[^}]+\}/.test(diff)) {
        messages.push(`Adição de um novo estilo inline no arquivo ${file}`);
    }

    // Detecção de criação de novo arquivo
    if (/^\+\s*$/.test(diff)) {
        messages.push(`Criação de um novo arquivo ${file}`);
    }

    // Detecção de remoção de linhas de código
    if (/^-/.test(diff)) {
        messages.push(`Remoção de linhas de código no arquivo ${file}`);
    }

    // Detecção de criação de novo elemento HTML
    if (/^<\w+/.test(diff)) {
        messages.push(`Criação de um novo elemento HTML no arquivo ${file}`);
    }

    // Detecção de mudança na estrutura de pastas
    if (/^mv\s+/.test(diff)) {
        messages.push(`Mudança na estrutura de pastas no arquivo ${file}`);
    }

    // Detecção de alteração em funções de manipulação de eventos
    if (/addEventListener | onClick | onChange /.test(diff)) {
        messages.push(`Alteração em funções de manipulação de eventos no arquivo ${file}`);
    }

    // Detecção de alteração de conteúdo em array ou objeto
    if (/\w+\s*=\s*\[.*\]|\w+\s*=\s*{.*}/.test(diff)) {
        messages.push(`Alteração de conteúdo em um array ou objeto no arquivo ${file}`);
    }

    // Detecção de criação de testes unitários
    if (/describe\(|it\(|test\(/.test(diff)) {
        messages.push(`Criação de testes unitários no arquivo ${file}`);
    }

    // Se não houver mensagens específicas, considera como alterações gerais ou refatoração
    if (messages.length === 0) {
        messages.push(`Alterações gerais ou refatoração no arquivo ${file}`);
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
                const [status, file] = [line.slice(0, 2), line.slice(3)];
                const commitType = getCommitType(status);
                if (file) {
                    console.log(`📁 Adicionando arquivo ${file}`);
                    execSync(`git add "${file}"`);
                    const diff = execSync(`git diff -- "${file}"`).toString();
                    const message = generateMessageFromDiff(diff, file);
                    execSync(`git commit -m "${commitType}: ${message}"`);
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
                    const diff = execSync(`git diff -- "${file}"`).toString();
                    const message = generateMessageFromDiff(diff, file);
                    execSync(`git commit -m "feat: ${message}"`);
                    console.log(`✅ Ficheiro não rastreado commitado ${file}`);
                }
            });

            const modifiedFiles = execSync('git diff --name-only').toString().trim().split('\n');
            modifiedFiles.forEach(file => {
                if (file) {
                    console.log(`📝 Adicionando ficheiro modificado ${file}`);
                    execSync(`git add "${file}"`);
                    const diff = execSync(`git diff -- "${file}"`).toString();
                    const message = generateMessageFromDiff(diff, file);
                    execSync(`git commit -m "fix: ${message}"`);
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

