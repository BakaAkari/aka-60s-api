# 60s API 执行文档

## 概述

本文档详细说明了如何使用60s API实现信息聚合功能，包括API参数约定、接口调用方式和指令实现方案。

## API 基本信息

### 主域名
- **主域名**: `https://192.168.50.55:4399/`
- **备用域名**:
  - `https://60s.b23.run`
  - `https://60s-api-cf.viki.moe`
  - `https://60s-api.114128.xyz`
  - `https://60s-api-cf.114128.xyz`

### 返回格式支持
所有接口均支持两种返回格式，通过 `encoding` 查询参数控制：

- **JSON格式** (`json`): 默认格式，返回结构化数据
- **纯文本格式** (`text`): 返回纯文本内容

示例：
```
https://192.168.50.55:4399/v2/60s?encoding=json
https://192.168.50.55:4399/v2/60s?encoding=text
```

## 字段命名约定

### 时间戳字段
涉及时间戳的参数提供两种格式：

- **13位时间戳**: 字段名以 `_at` 结尾
- **格式化日期时间字符串**: 字段名无 `_at` 后缀

示例：
- `updated`: `2025/01/13 07:22:32` (格式化字符串)
- `updated_at`: `1736770800082` (13位时间戳)

### 通用字段命名
- **链接、原文字段**: 统一命名为 `link`
- **封面图、主图字段**: 统一命名为 `cover`

## 核心接口说明

### 1. 每日60秒读懂世界

**接口地址**: `/v2/60s`

**请求参数**:
- `encoding` (可选): `json`、`text`、`image`、`image-proxy`，默认 `json`

**返回示例** (JSON格式):
```json
{
  "code": 200,
  "message": "所有数据均来自官方，确保稳定与实时",
  "data": {
    "date": "2025-01-13",
    "news": [
      "1、新闻标题1",
      "2、新闻标题2",
      "3、新闻标题3"
    ],
    "weiyu": "每日微语"
  }
}
```

**返回示例** (文本格式):
```
2025-01-13 每日60秒读懂世界

1、新闻标题1
2、新闻标题2
3、新闻标题3

每日微语
```

### 2. 周期资讯类接口

#### 2.1 必应每日壁纸
- **接口地址**: `/v2/bing`
- **说明**: 获取必应每日壁纸
- **encoding支持**: `json`、`text`、`image`

#### 2.2 当日货币汇率
- **接口地址**: `/v2/exchange`
- **说明**: 获取当日货币汇率信息
- **encoding支持**: `json`、`text`

#### 2.3 历史上的今天
- **接口地址**: `/v2/history`
- **说明**: 数据来源于百度百科
- **encoding支持**: `json`、`text`

#### 2.4 Epic Games 游戏
- **接口地址**: `/v2/epic`
- **说明**: 获取 Epic Games 每周免费游戏列表
- **encoding支持**: `json`、`text`

#### 2.5 历史上的今天
- **接口地址**: `/v2/today-in-history`
- **说明**: 数据来源于百度百科
- **encoding支持**: `json`、`text`
- **返回数据结构**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "date": "8-26",
      "month": 8,
      "day": 26,
      "items": [
        {
          "title": "事件标题",
          "year": "年份",
          "description": "事件描述",
          "event_type": "birth/event/death",
          "link": "百科详情链接"
        }
      ]
    }
  }
  ```

### 3. 热门榜单类接口

#### 3.1 抖音热搜
- **接口地址**: `/v2/douyin`
- **说明**: 获取抖音实时热搜
- **encoding支持**: `json`、`text`

#### 3.2 微博热搜
- **接口地址**: `/v2/weibo`
- **说明**: 获取微博实时热搜
- **encoding支持**: `json`、`text`

#### 3.3 哔哩哔哩热搜
- **接口地址**: `/v2/bilibili`
- **说明**: 获取哔哩哔哩实时热搜
- **encoding支持**: `json`、`text`

#### 3.4 百度实时热搜
- **接口地址**: `/v2/baidu`
- **说明**: 获取百度实时热搜
- **encoding支持**: `json`、`text`

#### 3.5 知乎话题榜
- **接口地址**: `/v2/zhihu`
- **说明**: 获取知乎话题榜
- **encoding支持**: `json`、`text`
- **返回数据结构**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "title": "话题标题",
        "detail": "话题详情",
        "cover": "封面图URL",
        "hot_value_desc": "热度描述",
        "answer_cnt": 1234,
        "follower_cnt": 5678,
        "comment_cnt": 90,
        "created_at": 1736770800082,
        "created": "2025-01-13 07:22:32",
        "link": "原文链接"
      }
    ]
  }
  ```

### 4. 实用功能类接口

#### 4.1 实时天气
- **接口地址**: `/v2/weather`
- **说明**: 天气数据来源于腾讯天气
- **encoding支持**: `json`、`text`

#### 4.2 天气预报
- **接口地址**: `/v2/weather-forecast`
- **说明**: 天气数据来源于腾讯天气
- **encoding支持**: `json`、`text`

#### 4.3 百度百科词条
- **接口地址**: `/v2/baike`
- **说明**: 获取百度百科词条信息
- **encoding支持**: `json`、`text`

#### 4.4 在线翻译
- **接口地址**: `/v2/translate`
- **说明**: 支持109种语言，数据来源于有道翻译
- **encoding支持**: `json`、`text`

#### 4.5 生成二维码
- **接口地址**: `/v2/qrcode`
- **说明**: 生成二维码
- **encoding支持**: `json`、`text`、`image`

#### 4.6 公网IP地址
- **接口地址**: `/v2/ip`
- **说明**: 获取公网IP地址信息
- **encoding支持**: `json`、`text`

### 5. 消遣娱乐类接口

#### 5.1 随机一言
- **接口地址**: `/v2/hitokoto`
- **说明**: 获取随机一言
- **encoding支持**: `json`、`text`

#### 5.2 随机运势
- **接口地址**: `/v2/fortune`
- **说明**: 获取随机运势
- **encoding支持**: `json`、`text`

#### 5.3 随机搞笑段子
- **接口地址**: `/v2/joke`
- **说明**: 获取随机搞笑段子
- **encoding支持**: `json`、`text`

#### 5.4 随机冷笑话
- **接口地址**: `/v2/cold-joke`
- **说明**: 获取随机冷笑话
- **encoding支持**: `json`、`text`

## 模块化设计方案

### 1. 插件架构设计

为了实现可扩展化和模块化设计，建议采用以下架构：

```
aka-60s-api/
├── src/
│   ├── index.ts                 # 主入口文件
│   ├── core/                   # 核心模块
│   │   ├── api-client.ts       # API客户端
│   │   ├── config-manager.ts   # 配置管理
│   │   └── error-handler.ts    # 错误处理
│   ├── modules/                # 功能模块
│   │   ├── news/               # 新闻模块
│   │   │   ├── index.ts
│   │   │   └── 60s-news.ts
│   │   ├── trends/             # 热搜模块
│   │   │   ├── index.ts
│   │   │   ├── weibo-trends.ts
│   │   │   ├── douyin-trends.ts
│   │   │   └── bilibili-trends.ts
│   │   ├── tools/              # 工具模块
│   │   │   ├── index.ts
│   │   │   ├── weather.ts
│   │   │   ├── translate.ts
│   │   │   └── qrcode.ts
│   │   └── entertainment/      # 娱乐模块
│   │       ├── index.ts
│   │       ├── hitokoto.ts
│   │       └── fortune.ts
│   ├── types/                  # 类型定义
│   │   ├── api.ts
│   │   └── config.ts
│   └── utils/                  # 工具函数
│       ├── formatter.ts
│       └── validator.ts
```

### 2. 核心模块设计

#### 2.1 API客户端 (api-client.ts)
```typescript
export class APIClient {
  private baseURL: string
  private timeout: number
  
  constructor(config: APIConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
  }
  
  async request<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    // 统一的API请求处理
  }
  
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    // GET请求封装
  }
}
```

#### 2.2 配置管理 (config-manager.ts)
```typescript
export class ConfigManager {
  private config: PluginConfig
  
  constructor(config: PluginConfig) {
    this.config = config
  }
  
  getEndpointConfig(module: string, endpoint: string): EndpointConfig {
    // 获取端点配置
  }
  
  updateConfig(updates: Partial<PluginConfig>): void {
    // 更新配置
  }
}
```

### 3. 模块化指令设计

#### 3.1 新闻模块指令
```typescript
// 60s新闻
ctx.command('60s [format:text/json]', '获取60秒读懂世界新闻')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const newsModule = new NewsModule(ctx, config)
    return await newsModule.get60sNews(argv.options.format)
  })

// 历史新闻
ctx.command('60s历史 [date] [format:text/json]', '获取历史新闻')
  .option('date', '-d <date> 日期')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const newsModule = new NewsModule(ctx, config)
    return await newsModule.getHistoryNews(argv.options.date, argv.options.format)
  })

// 历史上的今天
ctx.command('历史上的今天 [format:text/json]', '获取历史上的今天')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const newsModule = new NewsModule(ctx, config)
    return await newsModule.getTodayInHistory(argv.options.format)
  })
```

#### 3.2 热搜模块指令
```typescript
// 微博热搜
ctx.command('微博热搜 [format:text/json]', '获取微博热搜')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const trendsModule = new TrendsModule(ctx, config)
    return await trendsModule.getWeiboTrends(argv.options.format)
  })

// 抖音热搜
ctx.command('抖音热搜 [format:text/json]', '获取抖音热搜')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const trendsModule = new TrendsModule(ctx, config)
    return await trendsModule.getDouyinTrends(argv.options.format)
  })

// 知乎话题榜
ctx.command('知乎话题榜 [format:text/json]', '获取知乎话题榜')
  .option('format', '-f <format> 输出格式')
  .action(async (argv) => {
    const trendsModule = new TrendsModule(ctx, config)
    return await trendsModule.getZhihuTrends(argv.options.format)
  })
```

#### 3.3 工具模块指令
```typescript
// 天气查询
ctx.command('天气 <city> [format:text/json]', '查询天气信息')
  .option('format', '-f <format> 输出格式')
  .action(async (argv, city) => {
    const toolsModule = new ToolsModule(ctx, config)
    return await toolsModule.getWeather(city, argv.options.format)
  })

// 翻译
ctx.command('翻译 <text> [from] [to] [format:text/json]', '在线翻译')
  .option('from', '-f <lang> 源语言')
  .option('to', '-t <lang> 目标语言')
  .option('format', '-o <format> 输出格式')
  .action(async (argv, text) => {
    const toolsModule = new ToolsModule(ctx, config)
    return await toolsModule.translate(text, argv.options.from, argv.options.to, argv.options.format)
  })
```

### 4. 动态模块加载

#### 4.1 模块注册机制
```typescript
export class ModuleRegistry {
  private modules: Map<string, Module> = new Map()
  
  register(name: string, module: Module): void {
    this.modules.set(name, module)
  }
  
  getModule(name: string): Module | undefined {
    return this.modules.get(name)
  }
  
  loadModules(config: ModuleConfig[]): void {
    config.forEach(moduleConfig => {
      if (moduleConfig.enabled) {
        const module = this.createModule(moduleConfig)
        this.register(moduleConfig.name, module)
      }
    })
  }
}
```

#### 4.2 配置驱动的模块启用
```typescript
export interface PluginConfig {
  // 基础配置
  cooldownTime: number
  enableLog: boolean
  
  // 模块配置
  modules: {
    news: {
      enabled: boolean
      endpoints: string[]
    }
    trends: {
      enabled: boolean
      platforms: string[]
    }
    tools: {
      enabled: boolean
      features: string[]
    }
    entertainment: {
      enabled: boolean
      features: string[]
    }
  }
  
  // API配置
  api: {
    baseURL: string
    timeout: number
    retryAttempts: number
  }
}
```

### 5. 配置扩展

基于模块化设计，建议使用以下配置结构：

```typescript
export interface PluginConfig {
  // 基础配置
  cooldownTime: number
  enableLog: boolean
  defaultFormat: 'json' | 'text' | 'image'
  useForward: boolean  // 是否使用合并转发
  
  // API配置
  api: {
    baseURL: string
    timeout: number
    retryAttempts: number
    fallbackURLs: string[]
  }
  
  // 模块配置
  modules: {
    news: {
      enabled: boolean
      endpoints: ('60s' | 'history' | 'bing' | 'exchange' | 'epic' | 'today-in-history')[]
      cacheTime: number
    }
    trends: {
      enabled: boolean
      platforms: ('weibo' | 'douyin' | 'bilibili' | 'baidu' | 'zhihu')[]
      cacheTime: number
    }
    tools: {
      enabled: boolean
      features: ('weather' | 'translate' | 'qrcode' | 'baike' | 'ip')[]
      cacheTime: number
    }
    entertainment: {
      enabled: boolean
      features: ('hitokoto' | 'fortune' | 'joke' | 'cold-joke')[]
      cacheTime: number
    }
  }
  
  // 用户权限配置
  permissions: {
    allowGroups: string[]
    allowUsers: string[]
    adminUsers: string[]
  }
  
  // 缓存配置
  cache: {
    enabled: boolean
    defaultTTL: number
    maxSize: number
  }
}
```

### 6. 使用示例

#### 6.1 基础配置示例
```json
{
  "cooldownTime": 30,
  "enableLog": true,
  "defaultFormat": "json",
  "useForward": true,
  "api": {
    "baseURL": "https://192.168.50.55:4399",
    "timeout": 30000,
    "retryAttempts": 3,
    "fallbackURLs": [
      "https://60s.b23.run",
      "https://60s-api-cf.viki.moe"
    ]
  },
  "modules": {
    "news": {
      "enabled": true,
      "endpoints": ["60s", "history"],
      "cacheTime": 3600
    },
    "trends": {
      "enabled": true,
      "platforms": ["weibo", "douyin", "bilibili"],
      "cacheTime": 1800
    },
    "tools": {
      "enabled": true,
      "features": ["weather", "translate", "qrcode"],
      "cacheTime": 7200
    },
    "entertainment": {
      "enabled": false,
      "features": [],
      "cacheTime": 0
    }
  }
}
```

#### 6.2 指令使用示例
```
# 新闻模块
60s                    # 获取今日60秒新闻
60s -f text           # 获取今日新闻(文本格式)
60s历史 -d 2025-01-12  # 获取历史新闻
历史上的今天           # 获取历史上的今天
历史上的今天 -f text   # 获取历史上的今天(文本格式)

# 热搜模块
微博热搜              # 获取微博热搜
抖音热搜 -f text      # 获取抖音热搜(文本格式)
哔哩哔哩热搜          # 获取B站热搜
知乎话题榜            # 获取知乎话题榜
知乎话题榜 -f text    # 获取知乎话题榜(文本格式)

# 工具模块
天气 北京             # 查询北京天气
翻译 hello zh en      # 翻译hello从中文到英文
二维码 hello world     # 生成二维码

# 娱乐模块
一言                  # 获取随机一言
运势                  # 获取随机运势
段子                  # 获取随机段子
```

## 实现要点

### 1. 错误处理
- **统一错误处理**: 在 `error-handler.ts` 中实现统一的错误处理机制
- **API源切换**: 支持主域名和备用域名的自动切换
- **重试机制**: 实现指数退避重试策略
- **友好提示**: 根据错误类型提供用户友好的错误信息

### 2. 缓存机制
- **模块级缓存**: 每个模块独立管理缓存策略
- **TTL配置**: 支持不同接口设置不同的缓存时间
- **缓存清理**: 提供手动和自动缓存清理功能
- **内存管理**: 实现LRU缓存淘汰策略

### 3. 用户权限
- **模块权限**: 支持按模块控制用户访问权限
- **群组限制**: 支持群组级别的功能限制
- **管理员功能**: 提供配置管理和模块控制功能
- **权限继承**: 支持用户权限的继承和覆盖

### 4. 数据格式化
- **多格式支持**: 支持JSON、文本、图片等多种输出格式
- **模板系统**: 实现可配置的消息模板
- **数据转换**: 提供统一的数据格式转换接口
- **自定义渲染**: 支持模块自定义渲染逻辑
- **合并转发**: 支持使用合并转发避免消息过长导致刷屏

### 5. 模块管理
- **动态加载**: 支持运行时动态加载/卸载模块
- **依赖管理**: 处理模块间的依赖关系
- **版本控制**: 支持模块版本管理和兼容性检查
- **热更新**: 支持配置和模块的热更新

### 6. 性能优化
- **并发控制**: 实现请求并发限制和队列管理
- **资源池**: 使用连接池管理HTTP连接
- **懒加载**: 实现模块和功能的懒加载
- **预加载**: 支持常用数据的预加载

## 开发指南

### 1. 添加新模块

#### 1.1 创建模块文件
```typescript
// src/modules/example/index.ts
import { Context } from 'koishi'
import { APIClient } from '../../core/api-client'
import { ModuleConfig } from '../../types/config'

export class ExampleModule {
  private apiClient: APIClient
  
  constructor(private ctx: Context, private config: ModuleConfig) {
    this.apiClient = new APIClient(config.api)
  }
  
  async getExampleData(format: string = 'json') {
    const response = await this.apiClient.get('/v2/example', {
      encoding: format
    })
    return this.formatResponse(response, format)
  }
  
  private formatResponse(data: any, format: string) {
    // 实现数据格式化逻辑
  }
}
```

#### 1.2 注册模块
```typescript
// src/index.ts
import { ExampleModule } from './modules/example'

export function apply(ctx: Context, config: Config) {
  // 注册模块
  if (config.modules.example.enabled) {
    const exampleModule = new ExampleModule(ctx, config)
    // 注册指令
    ctx.command('示例 <param>', '示例功能')
      .action(async (argv, param) => {
        return await exampleModule.getExampleData()
      })
  }
}
```

### 2. 添加新接口

#### 2.1 定义接口类型
```typescript
// src/types/api.ts
export interface ExampleResponse {
  code: number
  message: string
  data: {
    // 定义数据结构
  }
}

// 历史上的今天数据类型
export interface HistoryItem {
  title: string
  year: string
  description: string
  event_type: 'birth' | 'event' | 'death'
  link: string
}

export interface HistoryData {
  date: string
  month: number
  day: number
  items: HistoryItem[]
}

export interface HistoryResponse {
  code: number
  message: string
  data: HistoryData
}

// 知乎话题榜数据类型
export interface ZhihuTopic {
  title: string
  detail: string
  cover: string
  hot_value_desc: string
  answer_cnt: number
  follower_cnt: number
  comment_cnt: number
  created_at: number
  created: string
  link: string
}

export interface ZhihuResponse {
  code: number
  message: string
  data: ZhihuTopic[]
}
```

#### 2.2 实现接口调用
```typescript
// 在模块中实现
async callExampleAPI(params: any) {
  try {
    const response = await this.apiClient.get('/v2/example', params)
    return response
  } catch (error) {
    this.handleError(error)
  }
}
```

### 4. 合并转发实现

#### 4.1 合并转发核心方法
```typescript
// 发送消息时使用合并转发避免刷屏
async sendMessage(session: Session, content: string, media: Element[] = []) {
  if (config.useForward && session.platform === 'onebot') {
    // 使用合并转发
    const forwardElements = [content, ...media].filter(Boolean)
    const forwardMessage = h("figure", {}, forwardElements)
    await session.send(forwardMessage)
  } else {
    // 普通文本发送
    const message = [content, ...media].filter(Boolean).join('\n\n')
    await session.send(message)
  }
}
```

#### 4.2 60s新闻合并转发实现
```typescript
// 60s新闻的合并转发实现
async send60sNews(session: Session, newsData: NewsData) {
  const { date, news, weiyu } = newsData
  
  // 构建文本内容
  const textContent = [
    `📰 ${date} 每日60秒读懂世界`,
    ...news.map((item, index) => `${index + 1}、${item}`),
    weiyu ? `\n💭 ${weiyu}` : ''
  ].filter(Boolean).join('\n')
  
  // 发送消息
  await this.sendMessage(session, textContent)
}
```

#### 4.3 历史上的今天实现
```typescript
// 历史上的今天的实现
async getTodayInHistory(format: string = 'json') {
  const response = await this.apiClient.get('/v2/today-in-history', {
    encoding: format
  })
  
  if (format === 'text') {
    return this.formatHistoryAsText(response.data)
  }
  
  return this.formatHistoryAsJson(response.data)
}

private formatHistoryAsText(data: HistoryData) {
  const { date, items } = data
  let text = `📅 ${date} 历史上的今天\n\n`
  
  items.forEach((item, index) => {
    const typeIcon = {
      'birth': '👶',
      'event': '📅', 
      'death': '💀'
    }[item.event_type] || '📅'
    
    text += `${index + 1}. ${typeIcon} ${item.year}年 - ${item.title}\n`
    text += `   ${item.description}\n\n`
  })
  
  return text
}

private formatHistoryAsJson(data: HistoryData) {
  return JSON.stringify(data, null, 2)
}
```

#### 4.4 知乎话题榜实现
```typescript
// 知乎话题榜的实现
async getZhihuTrends(format: string = 'json') {
  const response = await this.apiClient.get('/v2/zhihu', {
    encoding: format
  })
  
  if (format === 'text') {
    return this.formatZhihuAsText(response.data)
  }
  
  return this.formatZhihuAsJson(response.data)
}

private formatZhihuAsText(data: ZhihuTopic[]) {
  let text = `🔥 知乎话题榜\n\n`
  
  data.forEach((topic, index) => {
    text += `${index + 1}. ${topic.title}\n`
    text += `   📊 热度: ${topic.hot_value_desc}\n`
    text += `   💬 回答: ${topic.answer_cnt} | 关注: ${topic.follower_cnt} | 评论: ${topic.comment_cnt}\n`
    text += `   📝 ${topic.detail}\n`
    text += `   🔗 ${topic.link}\n\n`
  })
  
  return text
}

private formatZhihuAsJson(data: ZhihuTopic[]) {
  return JSON.stringify(data, null, 2)
}
```

#### 4.3 配置Schema更新
```typescript
export const Config: Schema<Config> = Schema.object({
  // 现有配置...
  useForward: Schema.boolean().default(false).description('是否使用合并转发(仅QQ平台效果最佳)')
})
```

### 3. 配置管理

#### 3.1 添加配置项
```typescript
// src/types/config.ts
export interface PluginConfig {
  // 现有配置...
  modules: {
    // 现有模块...
    example: {
      enabled: boolean
      features: string[]
      cacheTime: number
    }
  }
}
```

#### 3.2 更新Schema
```typescript
// src/index.ts
export const Config: Schema<Config> = Schema.object({
  // 现有配置...
  modules: Schema.object({
    // 现有模块...
    example: Schema.object({
      enabled: Schema.boolean().default(false),
      features: Schema.array(String).default([]),
      cacheTime: Schema.number().default(3600)
    })
  })
})
```

## 注意事项

### 1. API使用限制
- **频率限制**: 注意API调用频率限制，合理设置冷却时间
- **数据准确性**: 所有数据均来自官方，确保稳定与实时
- **接口变更**: 定期检查API文档，及时更新接口调用方式

### 2. 开发注意事项
- **错误处理**: 实现完善的错误处理和用户提示
- **性能优化**: 合理使用缓存机制，减少不必要的API调用
- **模块隔离**: 确保模块间的独立性，避免相互影响
- **配置验证**: 实现配置项的验证和默认值处理
- **合并转发**: 在QQ平台使用合并转发避免长消息刷屏，其他平台使用普通文本发送

### 3. 安全考虑
- **权限控制**: 实现细粒度的用户权限控制
- **输入验证**: 对所有用户输入进行验证和过滤
- **日志安全**: 避免在日志中记录敏感信息
- **API安全**: 使用HTTPS协议，避免API密钥泄露

### 4. 维护建议
- **版本管理**: 使用语义化版本号管理插件版本
- **文档更新**: 及时更新文档，保持与代码同步
- **测试覆盖**: 为关键功能编写单元测试和集成测试
- **性能监控**: 监控插件性能，及时发现和解决问题

## 更新日志

### v0.0.2 (当前版本)
- ✅ 基础60s新闻获取功能
- ✅ 支持JSON和文本格式输出
- ✅ 冷却时间控制
- ✅ 日志记录功能

### v0.1.0 (计划中)
- 🔄 模块化架构重构
- 🔄 多接口支持 (热搜、工具、娱乐等)
- 🔄 配置管理系统
- 🔄 缓存机制
- 🔄 用户权限控制
- 🔄 合并转发功能 (避免长消息刷屏)

### v0.2.0 (未来计划)
- 📋 历史数据查询
- 📋 数据导出功能
- 📋 自定义模板系统
- 📋 插件热更新
- 📋 性能监控面板

---

*本文档基于60s API官方参数约定编写，如有更新请参考官方文档。*
