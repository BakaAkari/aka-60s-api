import { Context, Schema, h } from 'koishi'

export const name = 'aka-60s-api'

export interface Config {
  cooldownTime: number
  enableLog: boolean
  enableSchedule: boolean
  scheduleTime: string
  scheduleChannels: string[]
  useForward: boolean
}

export const Config: Schema<Config> = Schema.object({
  cooldownTime: Schema.number().default(30).min(5).max(300).description('冷却时间(秒)'),
  enableLog: Schema.boolean().default(true).description('启用日志记录'),
  enableSchedule: Schema.boolean().default(false).description('启用定时发送新闻'),
  scheduleTime: Schema.string().default('08:00 / 1d').description('定时发送时间 (格式: HH:MM / 1d)'),
  scheduleChannels: Schema.array(String).default([]).description('定时发送的频道ID列表'),
  useForward: Schema.boolean().default(false).description('是否使用合并转发(仅QQ平台效果最佳)')
})

interface HistoryItem {
  title: string
  year: string
  description: string
  event_type: 'birth' | 'event' | 'death'
  link: string
}

interface HistoryData {
  date: string
  month: number
  day: number
  items: HistoryItem[]
}

interface HistoryResponse {
  code: number
  message: string
  data: HistoryData
}

interface ZhihuTopic {
  title: string
  detail: string
  cover: string
  link: string
  hot_value_desc: string
  answer_cnt: number
  follower_cnt: number
  comment_cnt: number
  created_at: number
  created: string
}

interface ZhihuResponse {
  code: number
  message: string
  data: ZhihuTopic[]
}


export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('aka-60s-api')
  const cooldowns: Map<string, number> = new Map()
  let scheduleInterval: NodeJS.Timeout | null = null

  // 日志函数
  function logInfo(message: string, data?: any) {
    if (config.enableLog && logger) {
      logger.info(message, data)
    }
  }

  function logError(message: string, error?: any) {
    if (config.enableLog && logger) {
      logger.error(message, error)
    }
  }

  // 检查冷却时间
  function checkCooldown(userId: string): boolean {
    const now = Date.now()
    const lastTime = cooldowns.get(userId) || 0
    const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
    
    if (timeLeft > 0) {
      return false
    }
    
    cooldowns.set(userId, now)
    return true
  }


  // 获取60秒新闻图片
  async function get60sNewsImage(): Promise<Buffer> {
    try {
      logInfo('60s API: 开始获取新闻图片')
      
      const response = await ctx.http.get('http://192.168.50.55:4399/v2/60s', {
        params: {
          encoding: 'image'
        },
        timeout: 30000,
        responseType: 'arraybuffer'
      }) as ArrayBuffer
      
      const buffer = Buffer.from(response)
      
      logInfo('60s API: 获取新闻图片成功', { 
        size: buffer.length
      })
      
      return buffer
    } catch (error) {
      logError('60s API: 获取新闻图片失败', error)
      throw error
    }
  }

  // 获取历史上的今天
  async function getTodayInHistory(): Promise<HistoryResponse> {
    try {
      logInfo('60s API: 开始获取历史上的今天')
      
      const response = await ctx.http.get('http://192.168.50.55:4399/v2/today-in-history', {
        params: {
          encoding: 'json'
        },
        timeout: 30000
      }) as HistoryResponse
      
      logInfo('60s API: 获取历史上的今天成功', { 
        code: response.code,
        hasData: !!response.data,
        itemsCount: response.data?.items?.length || 0
      })
      
      return response
    } catch (error) {
      logError('60s API: 获取历史上的今天失败', error)
      throw error
    }
  }

  // 获取知乎话题榜
  async function getZhihuTrends(): Promise<ZhihuResponse> {
    try {
      logInfo('60s API: 开始获取知乎话题榜')
      
      const response = await ctx.http.get('http://192.168.50.55:4399/v2/zhihu', {
        params: {
          encoding: 'json'
        },
        timeout: 30000
      }) as ZhihuResponse
      
      logInfo('60s API: 获取知乎话题榜成功', { 
        code: response.code,
        hasData: !!response.data,
        topicsCount: response.data?.length || 0
      })
      
      return response
    } catch (error) {
      logError('60s API: 获取知乎话题榜失败', error)
      throw error
    }
  }

  // 发送新闻到指定频道
  async function sendNewsToChannels() {
    if (config.scheduleChannels.length === 0) {
      logInfo('60s API: 没有配置定时发送频道')
      return
    }

    try {
      const imageBuffer = await get60sNewsImage()
      const imageMessage = h.image(imageBuffer, 'image/png')
      
      for (const channelId of config.scheduleChannels) {
        try {
          await ctx.broadcast([channelId], imageMessage)
          logInfo('60s API: 定时发送新闻成功', { channelId })
        } catch (error) {
          logError('60s API: 定时发送新闻到频道失败', { channelId, error })
        }
      }
    } catch (error) {
      logError('60s API: 定时发送新闻失败', error)
    }
  }

  // 解析时间格式
  function parseScheduleTime(timeStr: string): number {
    // 简单解析，支持格式如 "08:00 / 1d" 或 "1h" 或 "30m"
    if (timeStr.includes('/')) {
      // 格式: "08:00 / 1d" - 每天8点
      const [timePart] = timeStr.split(' / ')
      const [hours, minutes] = timePart.split(':').map(Number)
      const now = new Date()
      const targetTime = new Date()
      targetTime.setHours(hours, minutes, 0, 0)
      
      // 如果今天的时间已过，设置为明天
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1)
      }
      
      return targetTime.getTime() - now.getTime()
    } else if (timeStr.includes('h')) {
      // 格式: "1h" - 1小时后
      const hours = parseInt(timeStr.replace('h', ''))
      return hours * 60 * 60 * 1000
    } else if (timeStr.includes('m')) {
      // 格式: "30m" - 30分钟后
      const minutes = parseInt(timeStr.replace('m', ''))
      return minutes * 60 * 1000
    } else {
      // 默认1小时
      return 60 * 60 * 1000
    }
  }

  // 设置定时任务
  function setupSchedule() {
    if (!config.enableSchedule) {
      logInfo('60s API: 定时发送功能已禁用')
      return
    }

    // 清除现有任务
    if (scheduleInterval) {
      clearInterval(scheduleInterval)
      scheduleInterval = null
    }

    try {
      const interval = parseScheduleTime(config.scheduleTime)
      
      // 设置定时器
      scheduleInterval = setInterval(async () => {
        await sendNewsToChannels()
      }, interval)

      logInfo('60s API: 定时任务设置成功', { 
        scheduleTime: config.scheduleTime,
        interval: interval,
        channels: config.scheduleChannels
      })
    } catch (error) {
      logError('60s API: 设置定时任务失败', error)
    }
  }


  // 设置新闻指令 (图片格式)
  ctx.command('新闻', '获取60秒新闻图片')
    .action(async (argv) => {
      const userId = argv.session.userId
      
      // 检查冷却时间
      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }
      
      try {
        logInfo('60s API: 用户请求新闻图片', { userId })
        
        // 获取新闻图片
        const imageBuffer = await get60sNewsImage()
        
        // 发送图片
        const imageMessage = h.image(imageBuffer, 'image/png')
        await argv.session.send(imageMessage)
        
        logInfo('60s API: 成功发送新闻图片', { 
          size: imageBuffer.length,
          userId: userId
        })
        
      } catch (error) {
        logError('60s API: 处理新闻图片请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取新闻图片失败，请稍后重试'
      }
    })

  // 设置历史上的今天指令
  ctx.command('历史上的今天', '获取历史上的今天')
    .action(async (argv) => {
      const userId = argv.session.userId
      
      // 检查冷却时间
      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }
      
      try {
        logInfo('60s API: 用户请求历史上的今天', { userId })
        
        // 获取历史上的今天数据
        const response = await getTodayInHistory()
        
        if (response.code !== 200) {
          logError('60s API: 返回错误', { 
            code: response.code, 
            message: response.message
          })
          return `获取历史上的今天失败: ${response.message || '未知错误'}`
        }
        
        if (!response.data || !response.data.items || response.data.items.length === 0) {
          logError('60s API: 返回数据为空')
          return '获取历史上的今天失败: 未获取到历史事件数据'
        }
        
        // 构建消息内容
        const { date, items } = response.data
        
        if (config.useForward && argv.session.platform === 'onebot') {
          // 使用合并转发
          const forwardElements = [
            `📅 ${date} 历史上的今天`,
            ...items.map((item, index) => {
              const typeIcon = {
                'birth': '👶',
                'event': '📅', 
                'death': '💀'
              }[item.event_type] || '📅'
              
              return `${index + 1}. ${typeIcon} ${item.year}年 - ${item.title}\n${item.description}`
            })
          ]
          
          const forwardMessage = h("figure", {}, forwardElements)
          await argv.session.send(forwardMessage)
        } else {
          // 普通文本发送
          let message = `📅 ${date} 历史上的今天\n\n`
          
          items.forEach((item, index) => {
            const typeIcon = {
              'birth': '👶',
              'event': '📅', 
              'death': '💀'
            }[item.event_type] || '📅'
            
            message += `${index + 1}. ${typeIcon} ${item.year}年 - ${item.title}\n${item.description}\n\n`
          })
          
          await argv.session.send(message)
        }
        
        logInfo('60s API: 成功发送历史上的今天', { 
          date: date,
          itemsCount: items.length,
          userId: userId
        })
        
      } catch (error) {
        logError('60s API: 处理历史上的今天请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取历史上的今天失败，请稍后重试'
      }
    })

  // 设置知乎话题榜指令
  ctx.command('知乎话题榜', '获取知乎话题榜')
    .action(async (argv) => {
      const userId = argv.session.userId
      
      // 检查冷却时间
      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }
      
      try {
        logInfo('60s API: 用户请求知乎话题榜', { userId })
        
        // 获取知乎话题榜数据
        const response = await getZhihuTrends()
        
        if (response.code !== 200) {
          logError('60s API: 返回错误', { 
            code: response.code, 
            message: response.message
          })
          return `获取知乎话题榜失败: ${response.message || '未知错误'}`
        }
        
        if (!response.data || response.data.length === 0) {
          logError('60s API: 返回数据为空')
          return '获取知乎话题榜失败: 未获取到话题数据'
        }
        
        // 构建消息内容
        const topics = response.data
        
        if (config.useForward && argv.session.platform === 'onebot') {
          // 使用合并转发
          const forwardElements = [
            `🔥 知乎话题榜`,
            ...topics.map((topic, index) => {
              return `${index + 1}. ${topic.title}\n${topic.detail}\n🔗 ${topic.link}`
            })
          ]
          
          const forwardMessage = h("figure", {}, forwardElements)
          await argv.session.send(forwardMessage)
        } else {
          // 普通文本发送 - 限制长度避免消息过长
          let message = `🔥 知乎话题榜\n\n`
          const maxTopics = 10 // 限制最多显示10个话题
          const topicsToShow = topics.slice(0, maxTopics)
          
          topicsToShow.forEach((topic, index) => {
            // 截断过长的详情
            const shortDetail = topic.detail.length > 200 ? topic.detail.substring(0, 200) + '...' : topic.detail
            message += `${index + 1}. ${topic.title}\n${shortDetail}\n🔗 ${topic.link}\n\n`
          })
          
          if (topics.length > maxTopics) {
            message += `\n... 还有 ${topics.length - maxTopics} 个话题，完整内容请使用合并转发模式`
          }
          
          await argv.session.send(message)
        }
        
        logInfo('60s API: 成功发送知乎话题榜', { 
          topicsCount: topics.length,
          userId: userId
        })
        
      } catch (error) {
        logError('60s API: 处理知乎话题榜请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取知乎话题榜失败，请稍后重试'
      }
    })

  // 插件启动时初始化定时任务
  ctx.on('ready', async () => {
    await setupSchedule()
  })

  // 插件卸载时清理资源
  ctx.on('dispose', () => {
    cooldowns.clear()
    if (scheduleInterval) {
      clearInterval(scheduleInterval)
      scheduleInterval = null
    }
  })
}
