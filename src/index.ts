
import { execSync } from 'child_process';

export class GitCommitLib {
  private count: number;

  constructor() {
    this.count = 1;
  }

  public addAndCommitFiles(): void {
    console.log('Adding untracked files...');
    this.addUntrackedFiles();
    console.log('Adding modified files...');
    this.addModifiedFiles();
  }

  public testAddUntrackedFiles(): void {
    this.addUntrackedFiles();
  }

  public testAddModifiedFiles(): void {
    this.addModifiedFiles();
  }

  private addUntrackedFiles(): void {
    try {
      const untrackedFiles = execSync('git ls-files --others --exclude-standard').toString().trim().split('\n');
      if (untrackedFiles.length === 0) {
        console.log('No untracked files to add.');
        return;
      }
      untrackedFiles.forEach(file => {
        if (file) {
          console.log(`Adding untracked file ${file}`);
          execSync(`git add "${file}"`);
          execSync(`git commit -m "commit ${this.count++} - ${file}"`);
        }
      });
    } catch (error) {
      console.error('Error adding untracked files:', (error as Error).message);
    }
  }

  private addModifiedFiles(): void {
    try {
      const modifiedFiles = execSync('git diff --name-only').toString().trim().split('\n');
      if (modifiedFiles.length === 0) {
        console.log('No modified files to add.');
        return;
      }
      modifiedFiles.forEach(file => {
        if (file) {
          console.log(`Adding modified file ${file}`);
          execSync(`git add "${file}"`);
          execSync(`git commit -m "commit ${this.count++} - ${file}"`);
        }
      });
    } catch (error) {
      console.error('Error adding modified files:', (error as Error).message);
    }
  }
}
