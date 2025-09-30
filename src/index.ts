import { Context, Schema, h } from 'koishi'

export const name = 'aka-60s-api'

export interface Config {
  apiKey: string
  cooldownTime: number
  enableLog: boolean
}

export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string().required().description('API密钥'),
  cooldownTime: Schema.number().default(30).min(5).max(300).description('冷却时间(秒)'),
  enableLog: Schema.boolean().default(true).description('启用日志记录')
})

interface NewsResponse {
  code: number
  msg: string
  data: {
    title: string
    content: string
    image: string
    time: string
  }
  request_id: string
}

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('aka-60s-api')
  const cooldowns: Map<string, number> = new Map()

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

  // 获取60秒新闻
  async function get60sNews(): Promise<NewsResponse> {
    try {
      logInfo('60s API: 开始获取新闻')
      
      const response = await ctx.http.get('https://v2.xxapi.cn/api/get60sNews', {
        params: {
          key: config.apiKey
        },
        timeout: 30000
      }) as NewsResponse
      
      logInfo('60s API: 获取新闻成功', { 
        code: response.code, 
        hasData: !!response.data,
        requestId: response.request_id
      })
      
      return response
    } catch (error) {
      logError('60s API: 获取新闻失败', error)
      throw error
    }
  }

  // 设置60秒新闻指令
  ctx.command('60s', '获取60秒新闻')
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
        logInfo('60s API: 用户请求新闻', { userId })
        
        // 发送处理中消息
        await argv.session.send('正在获取60秒新闻，请稍候...')
        
        // 获取新闻
        const response = await get60sNews()
        
        if (response.code !== 200) {
          logError('60s API: 返回错误', { 
            code: response.code, 
            msg: response.msg,
            requestId: response.request_id
          })
          return `获取新闻失败: ${response.msg || '未知错误'}`
        }
        
        if (!response.data) {
          logError('60s API: 返回数据为空')
          return '获取新闻失败: 未获取到新闻数据'
        }
        
        // 构建消息内容
        const { title, content, image, time } = response.data
        
        let message = `📰 ${title}\n\n${content}\n\n⏰ ${time}`
        
        // 如果有图片，添加图片
        if (image) {
          const imageMessage = h.image(image)
          await argv.session.send(imageMessage)
        }
        
        logInfo('60s API: 成功发送新闻', { 
          title: title.substring(0, 50) + '...',
          hasImage: !!image,
          requestId: response.request_id
        })
        
        return message
        
      } catch (error) {
        logError('60s API: 处理请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取新闻失败，请稍后重试'
      }
    })

  // 添加重置冷却时间的指令
  ctx.command('60s重置', '重置60秒新闻冷却时间')
    .action(async (argv) => {
      const userId = argv.session.userId
      const hadCooldown = cooldowns.has(userId)
      
      cooldowns.delete(userId)
      
      logInfo('60s API: 手动重置冷却时间', { userId, hadCooldown })
      
      return hadCooldown ? '已重置冷却时间，可以重新使用60s指令' : '当前没有冷却时间'
    })

  // 插件卸载时清理资源
  ctx.on('dispose', () => {
    cooldowns.clear()
  })
}
