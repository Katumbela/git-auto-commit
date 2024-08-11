#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const targetDir = '.';
function getCommitType(status) {
    if (status === 'A')
        return 'feat';
    if (status === 'M')
        return 'fix';
    if (status === 'D')
        return 'chore';
    return 'chore';
}
function generateMessageFromDiff(diff, file) {
    var _a, _b;
    const messages = [];
    // Detecção de adição de função
    if (/^\+?\s*function\s+(\w+)/.test(diff)) {
        const functionName = (_a = diff.match(/function\s+(\w+)/)) === null || _a === void 0 ? void 0 : _a[1];
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
    // Detecção de estilização CSS
    if (/^\+?\s*(background-color|color|font-size)/.test(diff)) {
        messages.push(`Estilização de CSS em ${file}`);
    }
    // Detecção de remoção de função
    if (/^-?\s*function\s+(\w+)/.test(diff)) {
        const functionName = (_b = diff.match(/function\s+(\w+)/)) === null || _b === void 0 ? void 0 : _b[1];
        messages.push(`Remoção da função ${functionName} em ${file}`);
    }
    // Detecção de remoção de botão
    if (/^-?\s*<button/.test(diff)) {
        messages.push(`Remoção de um botão em ${file}`);
    }
    // Detecção de remoção de imagem
    if (/^-?\s*<img/.test(diff)) {
        messages.push(`Remoção de uma imagem em ${file}`);
    }
    // Detecção de remoção de estilização CSS
    if (/^-?\s*(background-color|color|font-size)/.test(diff)) {
        messages.push(`Remoção de estilização CSS em ${file}`);
    }
    // Detecção de adição de comentário
    if (/^\+?\s*\/\/\s/.test(diff)) {
        messages.push(`Adição de um comentário em ${file}`);
    }
    // Detecção de adição de log no console
    if (/^\+?\s*console\.log/.test(diff)) {
        messages.push(`Adição de log no console em ${file}`);
    }
    // Detecção de adição de importação
    if (/^\+?\s*import/.test(diff)) {
        messages.push(`Adição de importação em ${file}`);
    }
    // Detecção de manipulação de DOM
    if (/^\+?\s*(document\.querySelector|document\.getElementById)/.test(diff)) {
        messages.push(`Manipulação de DOM em ${file}`);
    }
    // Detecção de adição ou remoção de código
    if (/^\+/.test(diff) && !/-/.test(diff)) {
        messages.push(`Adição de código em ${file}`);
    }
    if (/-/.test(diff) && !/\+/.test(diff)) {
        messages.push(`Remoção de código em ${file}`);
    }
    if (/^\+/.test(diff) && /-/.test(diff)) {
        messages.push(`Modificação de código em ${file}`);
    }
    // Detecção de alteração de espaços ou linhas em branco
    if (/^\s+$/.test(diff)) {
        messages.push(`Alteração de espaço ou linhas em branco em ${file}`);
    }
    // Detecção de alteração de texto
    if (/^\+?\s*text/.test(diff)) {
        messages.push(`Alteração de texto em ${file}`);
    }
    // Detecção de criação de constante ou variável
    if (/^\+?\s*const\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma constante em ${file}`);
    }
    if (/^\+?\s*(let|var)\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma variável em ${file}`);
    }
    // Detecção de alteração em componente React
    if (/^\+?\s*(React\.Component|function\s+\w+\(.*\)\s*{)/.test(diff)) {
        messages.push(`Alteração em componente React em ${file}`);
    }
    // Detecção de adição de novo import
    if (/^\+?\s*import\s+\w+/.test(diff)) {
        messages.push(`Adição de novo import em ${file}`);
    }
    // Detecção de mudança de texto em elemento HTML
    if (/^\+?\s*>\s*\w+.*<\/\w+>/.test(diff)) {
        messages.push(`Mudança de texto em um elemento HTML em ${file}`);
    }
    // Detecção de criação de novo método de classe
    if (/^\+?\s*(public|private|protected)?\s*\w+\s*\(.*\)\s*{/.test(diff)) {
        messages.push(`Criação de um novo método de classe em ${file}`);
    }
    // Detecção de adição de estilo inline
    if (/^\+?\s*style=\{[^}]+\}/.test(diff)) {
        messages.push(`Adição de um novo estilo inline em ${file}`);
    }
    // Detecção de remoção de linhas de código
    if (/^-/.test(diff)) {
        messages.push(`Remoção de linhas de código em ${file}`);
    }
    // Detecção de criação de novo elemento HTML
    if (/^\s*<\w+/.test(diff)) {
        messages.push(`Criação de um novo elemento HTML em ${file}`);
    }
    // Detecção de mudança na estrutura de pastas
    if (/^\s*mv\s+/.test(diff)) {
        messages.push(`Mudança na estrutura de pastas em ${file}`);
    }
    // Detecção de alteração em funções de manipulação de eventos
    if (/^\+?\s*(addEventListener|onClick|onChange)/.test(diff)) {
        messages.push(`Alteração em funções de manipulação de eventos em ${file}`);
    }
    // Detecção de alteração de conteúdo em array ou objeto
    if (/^\+?\s*\w+\s*=\s*\[.*\]|\w+\s*=\s*{.*}/.test(diff)) {
        messages.push(`Alteração de conteúdo em um array ou objeto em ${file}`);
    }
    // Detecção de criação de testes unitários
    if (/^\+?\s*(describe\(|it\(|test\()/.test(diff)) {
        messages.push(`Criação de testes unitários em ${file}`);
    }
    // Se não houver mensagens específicas, considera como alterações gerais ou refatoração
    if (messages.length === 0) {
        messages.push(`Pequenas alterações ou refatoração em ${file}`);
    }
    return messages.join('; ');
}
function run() {
    try {
        process.chdir(path_1.default.resolve(targetDir));
        let count = 1;
        let pushAfterCommit = false;
        const args = process_1.argv.slice(2);
        if (args.includes('--all') || args.includes('-a')) {
            console.log('📦 Comitando todos os arquivos de uma vez.');
            const allFiles = (0, child_process_1.execSync)('git status --porcelain').toString().trim().split('\n');
            allFiles.forEach(line => {
                const [status, file] = [line.slice(0, 2).trim(), line.slice(3)];
                const commitType = getCommitType(status);
                if (file) {
                    const diff = (0, child_process_1.execSync)(`git diff ${file}`).toString().trim();
                    const message = generateMessageFromDiff(diff, file);
                    console.log(`📁 Adicionando arquivo ${file}`);
                    (0, child_process_1.execSync)(`git add "${file}"`);
                    (0, child_process_1.execSync)(`git commit -m "${commitType}: count++} - ${file}. ${message}"`);
                    console.log(`✅ Arquivo ${file} commitado com sucesso.`);
                }
            });
            console.log('✅ Todos os arquivos foram commitados.');
        }
        else {
            if (args.includes('--push') || args.includes('-p')) {
                pushAfterCommit = true;
            }
            const untrackedFiles = (0, child_process_1.execSync)('git ls-files --others --exclude-standard').toString().trim().split('\n');
            untrackedFiles.forEach(file => {
                if (file) {
                    console.log(`📁 Adicionando ficheiro não rastreado ${file}`);
                    (0, child_process_1.execSync)(`git add "${file}"`);
                    // execSync(`git commit -m "feat: commit ${count++} - ${file}. Criação de novo arquivo"`);
                    (0, child_process_1.execSync)(`git commit -m "feat: ${file}. Criação de novo arquivo"`);
                    console.log(`✅ Ficheiro não rastreado commitado ${file}`);
                }
            });
            const modifiedFiles = (0, child_process_1.execSync)('git diff --name-only').toString().trim().split('\n');
            modifiedFiles.forEach(file => {
                if (file) {
                    const diff = (0, child_process_1.execSync)(`git diff ${file}`).toString().trim();
                    const message = generateMessageFromDiff(diff, file);
                    console.log(`📝 Adicionando ficheiro modificado ${file}`);
                    (0, child_process_1.execSync)(`git add "${file}"`);
                    //execSync(`git commit -m "fix: commit ${count++} - ${file}. ${message}"`);
                    (0, child_process_1.execSync)(`git commit -m "fix: ${file}. ${message}"`);
                    console.log(`✅ Ficheiro modificado commitado ${file}`);
                }
            });
            if (pushAfterCommit) {
                console.log('🚀 Enviando alterações para o repositório remoto.');
                (0, child_process_1.execSync)('git push');
                console.log('✅ Alterações enviadas com sucesso.');
            }
        }
    }
    catch (error) {
        console.error('Erro ao executar seus commits:', error.message);
    }
}
run();
