#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const targetDir = '.';
function run() {
    try {
        process.chdir(path_1.default.resolve(targetDir));
        let count = 1;
        const untrackedFiles = (0, child_process_1.execSync)('git ls-files --others --exclude-standard').toString().trim().split('\n');
        untrackedFiles.forEach(file => {
            if (file) {
                console.log(`Adding untracked file ${file}`);
                (0, child_process_1.execSync)(`git add "${file}"`);
                (0, child_process_1.execSync)(`git commit -m "commit ${count++} - ${file}"`);
            }
        });
        const modifiedFiles = (0, child_process_1.execSync)('git diff --name-only').toString().trim().split('\n');
        modifiedFiles.forEach(file => {
            if (file) {
                console.log(`Adding modified file ${file}`);
                (0, child_process_1.execSync)(`git add "${file}"`);
                (0, child_process_1.execSync)(`git commit -m "commit ${count++} - ${file}"`);
            }
        });
    }
    catch (error) {
        console.error('Error executing commands:', error.message);
    }
}
run();
