const fs = require("fs")
const vscode = require("vscode");

class PagesProvider {

    constructor(context, workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.extensionContext = context;
        this.onDidChange = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.onDidChange.event;
    }
    getTreeItem(element) {
        return element;
    }
    refresh() {
        this.onDidChange.fire(undefined);
    }
    getChildren() {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }
        return Promise.resolve(this.getPagesJson());
    }
    getPagesJson() {
        const w2obj = {
            debugger: 'webview',
            browserDebugger: 'browser',
            preView: 'preView'
        }
        const toPage = (scriptName, scriptCommand) => {
            const cmdObj = {
              command: 'whistle.pages.openFile',
              title: 'Open Debugger',
              arguments: [scriptCommand]
            };
            return new Page(
              this.extensionContext,
              scriptName,
              scriptCommand,
              cmdObj
            );
          };
        return Object.keys(w2obj).map(script => toPage(script, w2obj[script]));
    }
    pathExists(p) {
        try {
            fs.accessSync(p);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}


class Page extends vscode.TreeItem {
    constructor(extensionContext, label, tooltip, command) {
        super(label);
        this.extensionContext = extensionContext;
        this.label = label;
        this.tooltip = tooltip;
        this.command = command;
        this.iconPath = {
            dark: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/dark/tool.svg')),
            light: vscode.Uri.file(this.extensionContext.asAbsolutePath('assets/light/tool.svg'))
        };
        this.contextValue = 'page';
    }
}

module.exports = PagesProvider;
