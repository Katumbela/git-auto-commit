
import { GitCommitLib } from '../index';
import { execSync } from 'child_process';

jest.mock('child_process', () => ({
    execSync: jest.fn().mockImplementation((cmd: string) => {
        console.log(`Mocked execSync: ${cmd}`);
        return Buffer.from('');
    }),
}));

describe('GitCommitLib', () => {
    let gitLib: GitCommitLib;

    beforeEach(() => {
        gitLib = new GitCommitLib();
    });

    test('should handle errors when adding untracked files', () => {
        (execSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });

        expect(() => gitLib.testAddUntrackedFiles()).not.toThrow();
        expect(console.error).toHaveBeenCalledWith('Error adding untracked files:', 'Simulated error');
    });

    test('should handle errors when adding modified files', () => {
        (execSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Simulated error');
        });

        expect(() => gitLib.testAddModifiedFiles()).not.toThrow();
        expect(console.error).toHaveBeenCalledWith('Error adding modified files:', 'Simulated error');
    });

});
