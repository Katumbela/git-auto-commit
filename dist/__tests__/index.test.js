"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/__tests__/index.test.ts
const index_1 = require("../index");
const child_process_1 = require("child_process");
jest.mock('child_process', () => ({
    execSync: jest.fn().mockImplementation((cmd) => {
        console.log(`Mocked execSync: ${cmd}`);
        return Buffer.from('');
    }),
}));
describe('GitCommitLib', () => {
    let gitLib;
    beforeEach(() => {
        gitLib = new index_1.GitCommitLib();
    });
    test('should add and commit untracked files', () => {
        gitLib.testAddUntrackedFiles();
        expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('git add'));
        expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('git commit -m'));
    });
    test('should add and commit modified files', () => {
        gitLib.testAddModifiedFiles();
        expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('git add'));
        expect(child_process_1.execSync).toHaveBeenCalledWith(expect.stringContaining('git commit -m'));
    });
});
