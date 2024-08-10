"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    test('should handle errors when adding untracked files', () => {
        child_process_1.execSync.mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });
        expect(() => gitLib.testAddUntrackedFiles()).not.toThrow();
        expect(console.error).toHaveBeenCalledWith('Error adding untracked files:', 'Simulated error');
    });
    test('should handle errors when adding modified files', () => {
        child_process_1.execSync.mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });
        expect(() => gitLib.testAddModifiedFiles()).not.toThrow();
        expect(console.error).toHaveBeenCalledWith('Error adding modified files:', 'Simulated error');
    });
});
