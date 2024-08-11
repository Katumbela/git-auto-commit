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
    var _a;
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
