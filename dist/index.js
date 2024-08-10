"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCommitLib = void 0;
// src/index.ts
const child_process_1 = require("child_process");
class GitCommitLib {
    constructor() {
        this.count = 1;
    }
    addAndCommitFiles() {
        this.addUntrackedFiles();
        this.addModifiedFiles();
    }
    testAddUntrackedFiles() {
        this.addUntrackedFiles();
    }
    testAddModifiedFiles() {
        this.addModifiedFiles();
    }
    addUntrackedFiles() {
        try {
            const untrackedFiles = (0, child_process_1.execSync)('git ls-files --others --exclude-standard').toString().trim().split('\n');
            untrackedFiles.forEach(file => {
                if (file) {
                    console.log(`Adding untracked file ${file}`);
                    (0, child_process_1.execSync)(`git add "${file}"`);
                    (0, child_process_1.execSync)(`git commit -m "commit ${this.count++} - ${file}"`);
                }
            });
        }
        catch (error) {
            console.error('Error adding untracked files:', error.message);
        }
    }
    addModifiedFiles() {
        try {
            const modifiedFiles = (0, child_process_1.execSync)('git diff --name-only').toString().trim().split('\n');
            modifiedFiles.forEach(file => {
                if (file) {
                    console.log(`Adding modified file ${file}`);
                    (0, child_process_1.execSync)(`git add "${file}"`);
                    (0, child_process_1.execSync)(`git commit -m "commit ${this.count++} - ${file}"`);
                }
            });
        }
        catch (error) {
            console.error('Error adding modified files:', error.message);
        }
    }
}
exports.GitCommitLib = GitCommitLib;
