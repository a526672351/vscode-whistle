# Whistle for VS Code

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/a526672351.vscode-whistle.svg)](https://marketplace.visualstudio.com/items?itemName=a526672351.vscode-whistle) [![Installs](https://vsmarketplacebadge.apphb.com/installs/a526672351.vscode-whistle.svg)](https://marketplace.visualstudio.com/items?itemName=a526672351.vscode-whistle) [![Rating](https://vsmarketplacebadge.apphb.com/rating/a526672351.vscode-whistle.svg)](https://marketplace.visualstudio.com/items?itemName=a526672351.vscode-whistle) 

whistle(读音[ˈwɪsəl]，拼音[wēisǒu])基于Node实现的跨平台web调试代理工具，类似的工具有Windows平台上的Fiddler，主要用于查看、修改HTTP、HTTPS、Websocket的请求、响应，也可以作为HTTP代理服务器使用，不同于Fiddler通过断点修改请求响应的方式，whistle采用的是类似配置系统hosts的方式，一切操作都可以通过配置实现，支持域名、路径、正则表达式、通配符、通配路径等多种匹配方式

## 功能特点

### 服务脚本

- 支持Whistle命令查看
- 支持快速运行Whistle命令

> Tip: w2 run 的方式无法用 stop / restart 命令停止/重启

## 调试工具

- 支持vscode标签页调试
- 支持浏览器调试
- 支持Browser Preview插件调试

> Tip: 获取 Browser Preview 插件通过 [marketplace](https://marketplace.visualstudio.com/items?itemName=auchenberg.vscode-browser-preview)

## 扩展配置

- 支持用户自定义配置Whistle代理端口号

> Tip: 用户自定义配置后再次执行服务脚本即可生效

## 更多

访问 [Whistle Docs](https://wproxy.org/whistle/) 了解更多 Whistle 相关功能。

-----------------------------------------------------------------------------------------------------------

## License

[MIT](https://github.com/a526672351/vscode-whistle/blob/master/LICENSE)
