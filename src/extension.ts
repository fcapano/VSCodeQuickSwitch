import * as fs from 'fs';
import *  as path from 'path';
import * as vscode from 'vscode';

const map = new Map<string, string[]>();

class FileGroup {
    pattern: string;
    list: string[];

    constructor(pattern: string, list: string[]) {
        this.pattern = pattern;
        this.list = list;
    }

    match(file: string) {
        return file.match(this.pattern);
    }

    getList(file: string) {
        const result = [];
        for (const item of this.list) {
            const filePath = file.replace(new RegExp(this.pattern), item);
            result.push(path.resolve(filePath));
        }

        return result;
    }
}

class Configuration {
    static Load(): FileGroup[] {
        const fileGroups = [];
        const fileGroupsConfig = vscode.workspace.getConfiguration().get<FileGroup[]>('quickSwitch.fileGroups');
        if (fileGroupsConfig) {
            for (const fileGroupConfig of fileGroupsConfig) {
                fileGroups.push(new FileGroup(fileGroupConfig.pattern, fileGroupConfig.list));
            }
        }

        return fileGroups;
    }
}

class FileQuickPickItem implements vscode.QuickPickItem {
    constructor(public readonly label: string, public readonly path: string) {
    }
}

async function switchFile(callback: (currentIndex: number, files: string[]) => Promise<string | undefined>) {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) {
        return;
    }

    const fileGroups = Configuration.Load();
    const currentFilePath = activeTextEditor.document.fileName;
    for (const fileGroup of fileGroups) {
        let files;
        if (fileGroup.match(currentFilePath)) {
            files = fileGroup.getList(currentFilePath);
        }
        else {
            files = map.get(currentFilePath) || [];
        }
        if (files.length === 0) {
            continue;
        }

        const currentIndex = files.indexOf(currentFilePath);
        const file = await callback(currentIndex, files);
        if (!file || !fs.existsSync(file)) {
            return;
        }

        if (!fileGroup.match(file)) {
            map.set(file, files);
        }

        const document = await vscode.workspace.openTextDocument(file);
        vscode.window.showTextDocument(document);

        return;
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.switchFile', () => {
        switchFile(async (currentIndex, files) => {
            const fileQuickPickItems = [];
            for (const file of files) {
                if (!fs.existsSync(file)) {
                    continue;
                }

                const relativePath = vscode.workspace.asRelativePath(file);
                fileQuickPickItems.push(new FileQuickPickItem('$(file)  ' + relativePath, file));
            }

            if (fileQuickPickItems.length === 0) {
                return;
            }

            const selectedFile = await vscode.window.showQuickPick(fileQuickPickItems);
            if (!selectedFile) {
                return;
            }

            return selectedFile.path;
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchNextFile', () => {
        switchFile(async (currentIndex, files) => {
            for (let i = 1; i < files.length; i++) {
                const file = files[(currentIndex + i) % files.length];
                if (fs.existsSync(file)) {
                    return file;
                }
            }
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchPreviousFile', () => {
        switchFile(async (currentIndex, files) => {
            for (let i = 1; i < files.length; i++) {
                const file = files[(currentIndex - i + files.length) % files.length];
                if (fs.existsSync(file)) {
                    return file;
                }
            }
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex1', () => {
        switchFile(async (currentIndex, files) => files[0]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex2', () => {
        switchFile(async (currentIndex, files) => files[1]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex3', () => {
        switchFile(async (currentIndex, files) => files[2]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex4', () => {
        switchFile(async (currentIndex, files) => files[3]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex5', () => {
        switchFile(async (currentIndex, files) => files[4]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex6', () => {
        switchFile(async (currentIndex, files) => files[5]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex7', () => {
        switchFile(async (currentIndex, files) => files[6]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex8', () => {
        switchFile(async (currentIndex, files) => files[7]);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.switchAtIndex9', () => {
        switchFile(async (currentIndex, files) => files[8]);
    }));
}