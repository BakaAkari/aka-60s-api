# koishi-plugin-aka-60s-api

[![npm](https://img.shields.io/npm/v/koishi-plugin-aka-60s-api?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-aka-60s-api)

调用60s API转发信息的工具 - 个人用

## 定时发送白名单说明

- `scheduleWhitelist` 是所有定时发送功能共用的**群组频道白名单**。
- 白名单为空时：不发送任何定时消息。
- 白名单非空时：仅向白名单中的群组频道定时发送。
- 仅影响定时发送，不影响手动指令。
