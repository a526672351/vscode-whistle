const fs = require("fs")
const vscode = require("vscode");
const { CONFIGURATION_KEY_PROXY_PORT, getDataFromSettingJson } = require("../utils");

class NpmScriptsProvider {

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
        return Promise.resolve(this.getDepsInPackageJson());
    }
    getDepsInPackageJson() {
        const w2obj = {
            install: 'npm i -g whistle',
            run: `w2 run -p ${getDataFromSettingJson(CONFIGURATION_KEY_PROXY_PORT)}`,
            status: 'w2 status',
            start: `w2 start -p ${getDataFromSettingJson(CONFIGURATION_KEY_PROXY_PORT)}`,
            restart: 'w2 restart',
            stop: 'w2 stop'
        }
        const toScript = (scriptName, scriptCommand) => {
            const cmdObj = {
              command: 'whistle.npmScripts.executeCommand',
              title: 'Run Script',
              arguments: [this.workspaceRoot, scriptCommand, scriptName]
            };
            return new Script(
              this.extensionContext,
              scriptName,
              scriptCommand,
              cmdObj
            );
          };
        return Object.keys(w2obj).map(script => toScript(script, w2obj[script]));
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


class Script extends vscode.TreeItem {
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
        this.contextValue = 'script';
    }
}

module.exports = NpmScriptsProvider;
