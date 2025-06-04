#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { argv } from 'process';
import { pipeline } from '@xenova/transformers';

const targetDir = '.';
let model: any = null;

function getCommitType(status: string): string {
    if (status === 'A') return 'feat';
    if (status === 'M') return 'fix';
    if (status === 'D') return 'chore';
    return 'chore';
}

function generateMessageFromDiff(diff: string, file: string): string {
    const messages: string[] = [];

    // Detecção de adição de função
    if (/function\s+(\w+)/.test(diff)) {
        const functionName = diff.match(/function\s+(\w+)/)?.[1];
        messages.push(`Criação da função ${functionName} em ${file}`);
    }

    // Detecção de remoção de função
    if (/function\s+(\w+)/.test(diff) && diff.startsWith('-')) {
        const functionName = diff.match(/function\s+(\w+)/)?.[1];
        messages.push(`Remoção da função ${functionName} em ${file}`);
    }

    // Detecção de criação de botão
    if (/<button/.test(diff)) {
        messages.push(`Criação de um botão em ${file}`);
    }

    // Detecção de remoção de botão
    if (/<button/.test(diff) && diff.startsWith('-')) {
        messages.push(`Remoção de um botão em ${file}`);
    }

    // Detecção de criação de imagem
    if (/<img/.test(diff)) {
        messages.push(`Criação de uma imagem em ${file}`);
    }

    // Detecção de remoção de imagem
    if (/<img/.test(diff) && diff.startsWith('-')) {
        messages.push(`Remoção de uma imagem em ${file}`);
    }

    // Detecção de estilização CSS
    if (/background-color|color|font-size/.test(diff)) {
        messages.push(`Estilização de CSS em ${file}`);
    }

    // Detecção de remoção de estilização CSS
    if (/background-color|color|font-size/.test(diff) && diff.startsWith('-')) {
        messages.push(`Remoção de estilização CSS em ${file}`);
    }

    // Detecção de adição de comentário
    if (/^\s*\/\/\s/.test(diff)) {
        messages.push(`Adição de um comentário em ${file}`);
    }

    // Detecção de adição de log no console
    if (/console\.log/.test(diff)) {
        messages.push(`Adição de log no console em ${file}`);
    }

    // Detecção de adição de importação
    if (/^\s*import/.test(diff)) {
        messages.push(`Adição de importação em ${file}`);
    }

    // Detecção de manipulação de DOM
    if (/document\.querySelector|document\.getElementById/.test(diff)) {
        messages.push(`Manipulação de DOM em ${file}`);
    }

    // Detecção de adição ou remoção de código
    if (/\+\s/.test(diff) && !/-/.test(diff)) {
        messages.push(`Adição de código em ${file}`);
    }
    if (/\-\s/.test(diff) && !/\+/.test(diff)) {
        messages.push(`Remoção de código em ${file}`);
    }
    if (/\+\s/.test(diff) && /\-\s/.test(diff)) {
        messages.push(`Modificação de código em ${file}`);
    }

    // Detecção de alteração de espaços ou linhas em branco
    if (/^\s+$/.test(diff)) {
        messages.push(`Alteração de espaço ou linhas em branco em ${file}`);
    }

    // Detecção de alteração de texto
    if (/text/.test(diff)) {
        messages.push(`Alteração de texto em ${file}`);
    }

    // Detecção de criação de constante ou variável
    if (/const\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma constante em ${file}`);
    }
    if (/let\s+\w+\s*=|var\s+\w+\s*=/.test(diff)) {
        messages.push(`Criação de uma variável em ${file}`);
    }

    // Detecção de alteração em componente React
    if (/React\.Component|function\s+\w+\(.*\)\s*{/.test(diff)) {
        messages.push(`Alteração em componente React em ${file}`);
    }

    // Detecção de adição de novo import
    if (/^import\s+\w+/.test(diff)) {
        messages.push(`Adição de novo import em ${file}`);
    }

    // Detecção de mudança de texto em elemento HTML
    if (/>.*<\/\w+>/.test(diff)) {
        messages.push(`Mudança de texto em um elemento HTML em ${file}`);
    }

    // Detecção de criação de método de classe
    if (/^\s*(public|private|protected)?\s*\w+\s*\(.*\)\s*{/.test(diff)) {
        messages.push(`Criação de um novo método de classe em ${file}`);
    }

    // Detecção de adição de estilo inline
    if (/style=\{[^}]+\}/.test(diff)) {
        messages.push(`Adição de um novo estilo inline em ${file}`);
    }

    // Detecção de criação de novo arquivo
    if (diff.startsWith('A ')) {
        messages.push(`Criação de um novo arquivo ${file}`);
    }

    // Detecção de remoção de linhas de código
    if (diff.startsWith('-')) {
        messages.push(`Remoção de linhas de código em ${file}`);
    }

    // Detecção de criação de novo elemento HTML
    if (/^<\w+/.test(diff)) {
        messages.push(`Criação de um novo elemento HTML em ${file}`);
    }

    // Detecção de mudança na estrutura de pastas
    if (diff.startsWith('mv ')) {
        messages.push(`Mudança na estrutura de pastas em ${file}`);
    }

    // Detecção de alteração em funções de manipulação de eventos
    if (/addEventListener|onClick|onChange/.test(diff)) {
        messages.push(`Alteração em funções de manipulação de eventos em ${file}`);
    }

    // Detecção de alteração de conteúdo em array ou objeto
    if (/\w+\s*=\s*\[.*\]|\w+\s*=\s*{.*}/.test(diff)) {
        messages.push(`Alteração de conteúdo em array ou objeto em ${file}`);
    }

    // Detecção de criação de testes unitários
    if (/describe\(|it\(|test\(/.test(diff)) {
        messages.push(`Criação de testes unitários em ${file}`);
    }

    return messages.join('; ');
}

async function initializeModel() {
    if (!model) {
        console.log('🔄 Initializing AI model...');
        model = await pipeline('text-generation', 'Xenova/distilgpt2');
        console.log('✅ AI model initialized');
    }
    return model;
}

async function generateMessageWithAI(diff: string, file: string): Promise<string> {
    try {
        const model = await initializeModel();
        const prompt = `Generate a conventional commit message for these changes in ${file}:\n${diff}\n\nCommit message:`;
        
        const result = await model(prompt, {
            max_length: 100,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2
        });

        let message = result[0].generated_text
            .replace(prompt, '')
            .trim()
            .split('\n')[0];

        if (!message.match(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/)) {
            message = `feat: ${message}`;
        }

        return message;
    } catch (error) {
        console.error('Error generating commit message:', error);
        return `Update ${file}`;
    }
}

async function run() {
    try {
        process.chdir(path.resolve(targetDir));

        let pushAfterCommit = false;
        const args = argv.slice(2);
        
        if (args.includes('--push') || args.includes('-p')) {
            pushAfterCommit = true;
        }

        // Get all changed files
        const statusOutput = execSync('git status --porcelain').toString().trim();
        if (!statusOutput) {
            console.log('No changes to commit.');
            return;
        }

        const files = statusOutput.split('\n').map(line => {
            const [status, file] = [line.slice(0, 2).trim(), line.slice(3).trim()];
            return { status, file };
        }).filter(({ file }) => file);

        // Group files by status
        const groups: { [key: string]: string[] } = {};
        files.forEach(({ status, file }) => {
            const commitType = getCommitType(status);
            if (!groups[commitType]) groups[commitType] = [];
            groups[commitType].push(file);
        });

        // Process each group
        for (const [commitType, fileList] of Object.entries(groups)) {
            if (fileList.length === 0) continue;

            // Get diff for all files in group
            const diffs = fileList.map(file => {
                try {
                    return execSync(`git diff -- "${file}"`).toString().trim();
                } catch (error) {
                    return ''; // File might be new or deleted
                }
            }).filter(diff => diff).join('\n');

            if (diffs) {
                const message = await generateMessageWithAI(diffs, fileList.join(', '));
                console.log(`📁 Processing files: ${fileList.join(', ')}`);
                
                // Add and commit files
                fileList.forEach(file => {
                    try {
                        execSync(`git add "${file}"`);
                    } catch (error) {
                        console.error(`Error adding file ${file}:`, error);
                    }
                });

                try {
                    execSync(`git commit -m "${commitType}: ${message}"`);
                    console.log(`✅ Files committed successfully.`);
                } catch (error) {
                    console.error('Error committing files:', error);
                }
            }
        }

        if (pushAfterCommit) {
            console.log('🚀 Pushing changes to remote repository...');
            try {
                execSync('git push');
                console.log('✅ Changes pushed successfully.');
            } catch (error) {
                console.error('Error pushing changes:', error);
            }
        }
    } catch (error) {
        console.error('Error executing commits:', (error as Error).message);
    }
}

run();
