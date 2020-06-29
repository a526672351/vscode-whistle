// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const NpmScriptsProvider = require('./src/view/nodeView');
const PagesProvider = require('./src/view/pageView');
const { openWhistle, executeCommand, loadWhistle, setPackageManager } = require('./src/utils');

function activate(context) {
    const terminals = new Map();
    const rootPath = vscode.workspace.rootPath;

    vscode.window.onDidCloseTerminal(term => terminals.delete(term.name));

    const npmScriptsProvider = new NpmScriptsProvider(context, rootPath);
    vscode.window.registerTreeDataProvider(
        'whistleScripts',
        npmScriptsProvider
    );
    vscode.commands.registerCommand('whistle.npmScripts.executeCommand', (script) => {
        executeCommand(terminals, script.command);
    });
    vscode.commands.registerCommand('whistle.npmScripts.refresh', () => npmScriptsProvider.refresh());
    
    loadWhistle(context)
    vscode.window.registerTreeDataProvider('whistlePages', new PagesProvider(context, rootPath));
    vscode.commands.registerCommand('whistle.pages.openFile', (page) => (
        openWhistle(context, page.command)
    ));
    

    context.subscriptions.push(vscode.commands.registerCommand('whistle.npmScripts.setProxyPort', () =>(
        setPackageManager()
    )));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
