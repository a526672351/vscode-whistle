const vscode = require("vscode");
const fs = require('fs');
const path = require('path');
let count = 0;
let panel;
const CONFIGURATION_SECTION = 'whistle';
const CONFIGURATION_KEY_PROXY_PORT = 'proxyPort';
const CONFIGURATION_SECTION_PROXY_PORT = `${CONFIGURATION_SECTION}.${CONFIGURATION_KEY_PROXY_PORT}`;
/**
 * 获取某个扩展文件绝对路径
 * @param context 上下文
 * @param relativePath 扩展中某个文件相对于根目录的路径，如 images/test.jpg
 */
function getExtensionFileAbsolutePath(context, relativePath) {
    return path.join(context.extensionPath, relativePath);
}

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
    count = count + 1;
    const resourcePath = getExtensionFileAbsolutePath(context, templatePath);
    // const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<iframe.+?src=")(.+?)"/g, (m, $1) => {
        return $1 + `http://127.0.0.1:${getDataFromSettingJson(CONFIGURATION_KEY_PROXY_PORT)}?count=` + count + '"';
    });
    // html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    //     return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    // });
    return html;
}

function createTerminalName(command) {
    return `whistle-${command}`;
}

function executeCommand(terminalMapping, script) {
    if (!script.arguments) {
        return;
    }
    const args = script.arguments;
    const [cwd, command] = args;
    let terminalName = args[2];
    if (!command) {
        return;
    }
    terminalName = terminalName || command;
    const name = createTerminalName(terminalName);
    let terminal;
    if (terminalMapping.has(name)) {
        terminal = terminalMapping.get(name);
    }
    else {
        const terminalOptions = { cwd, name };
        terminal = vscode.window.createTerminal(terminalOptions);
        terminalMapping.set(name, terminal);
    }
    terminal.show();
    terminal.sendText(command);
}

function createWebview () {
    if (!panel || panel._store._isDisposed) {
        panel =  vscode.window.createWebviewPanel(
            'whistleWebview', // viewType
            "Whistle Web Debugger", // 视图标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个部位
            {
                enableScripts: true, // 启用JS，默认禁用
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            }
        );
    }
}

function loadWhistle (context) {
    if (!panel || panel._store._isDisposed) {
        createWebview ()
    }
    panel.webview.html = getWebViewContent(context, './src/view/index.html');
}

function openWhistle(context, page) {
    if (!page.arguments) {
        return;
    }
    const args = page.arguments;
    const [command] = args;
    if (!command) {
        return;
    }
    if (command == 'preView') {
       let preview = vscode.extensions.getExtension('auchenberg.vscode-browser-preview')
       preview.activate().then(() => {
        console.log( "Extension activated");
        vscode.commands.executeCommand("browser-preview.openPreview",`http://127.0.0.1:${getDataFromSettingJson(CONFIGURATION_KEY_PROXY_PORT)}`);
       });
       return;
    }
    if (command == 'browser') {
        vscode.env.openExternal(vscode.Uri.parse(`http://127.0.0.1:${getDataFromSettingJson(CONFIGURATION_KEY_PROXY_PORT)}`));
    }
    loadWhistle(context)
}

function getDataFromSettingJson(section, defaultValue) {
    return vscode.workspace.getConfiguration(CONFIGURATION_SECTION).get(section, defaultValue);
  }

function saveDataToSettingJson(section, data, configurationTarget = true) {
    vscode.workspace.getConfiguration(CONFIGURATION_SECTION).update(section, data, configurationTarget);
}

function setPackageManager () {
    vscode.commands.executeCommand('workbench.action.openSettings', 'whistle.proxyPort')

    vscode.workspace.onDidChangeConfiguration(function (event) {
        const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_PROXY_PORT);
        if (isTrue) {
          console.log('proxyPort: did change');
        }
      });
}

module.exports = {
    CONFIGURATION_KEY_PROXY_PORT,
    getDataFromSettingJson,
    saveDataToSettingJson,
    setPackageManager,
    loadWhistle,
    executeCommand,
    openWhistle
};
