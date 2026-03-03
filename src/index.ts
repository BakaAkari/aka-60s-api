import { Context, Schema, h } from 'koishi'

export const name = 'aka-60s-api'
export const inject = ['database']

export interface Config {
  apiBaseUrl: string
  cooldownTime: number
  enableLog: boolean
  scheduleWhitelist: string[]
  enableSchedule: boolean
  scheduleTime: string
  useForward: boolean
  enableAiNewsSchedule: boolean
  aiNewsScheduleTime: string
  aiUseForward: boolean
  enableMoyuSchedule: boolean
  moyuScheduleTime: string
  enableGoldSchedule: boolean
  goldScheduleTime: string
  enableFuelSchedule: boolean
  fuelScheduleTime: string
  fuelDefaultRegion: string
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    apiBaseUrl: Schema.string().default('http://172.0.0.1:4399').description('60s 服务 URL（不含 /v2 路径）'),
    cooldownTime: Schema.number().default(30).min(5).max(300).description('冷却时间(秒)'),
    enableLog: Schema.boolean().default(true).description('启用日志记录'),
    scheduleWhitelist: Schema.array(String).default([]).description('定时发送群组白名单频道ID列表（格式: platform:channelId，如 onebot:123456）')
  }).description('基础设置'),
  Schema.object({
    enableSchedule: Schema.boolean().default(false).description('启用定时发送新闻'),
    scheduleTime: Schema.string().default('08:00').description('定时发送时间 (格式: HH:MM，每天固定时间)'),
    useForward: Schema.boolean().default(false).description('是否使用合并转发(仅QQ平台效果最佳)')
  }).description('每日新闻'),
  Schema.object({
    enableAiNewsSchedule: Schema.boolean().default(false).description('启用AI快报定时发送(仅当天)'),
    aiNewsScheduleTime: Schema.string().default('22:00').description('AI快报定时发送时间 (格式: HH:MM，每天固定时间)'),
    aiUseForward: Schema.boolean().default(false).description('AI快报是否使用合并转发(仅QQ平台效果最佳)')
  }).description('AI快报'),
  Schema.object({
    enableMoyuSchedule: Schema.boolean().default(false).description('启用摸鱼日报定时发送'),
    moyuScheduleTime: Schema.string().default('10:00').description('摸鱼日报定时发送时间 (格式: HH:MM，每天固定时间)'),
  }).description('摸鱼日报'),
  Schema.object({
    enableGoldSchedule: Schema.boolean().default(false).description('启用今日金价定时发送'),
    goldScheduleTime: Schema.string().default('09:00').description('今日金价定时发送时间 (格式: HH:MM，每天固定时间)'),
  }).description('今日金价'),
  Schema.object({
    enableFuelSchedule: Schema.boolean().default(false).description('启用今日油价定时发送'),
    fuelScheduleTime: Schema.string().default('09:30').description('今日油价定时发送时间 (格式: HH:MM，每天固定时间)'),
    fuelDefaultRegion: Schema.string().default('上海').description('今日油价默认地区')
  }).description('今日油价')
])

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

interface AiNewsItem {
  title: string
  detail: string
  link: string
  source: string
  date: string
}

interface AiNewsData {
  date: string
  news: AiNewsItem[]
}

interface AiNewsResponse {
  code: number
  message: string
  data: AiNewsData | AiNewsData[]
}

interface MoyuDateLunar {
  year: number
  month: number
  day: number
  yearCN: string
  monthCN: string
  dayCN: string
  isLeapMonth: boolean
  yearGanZhi: string
  monthGanZhi: string
  dayGanZhi: string
  zodiac: string
}

interface MoyuDateInfo {
  gregorian: string
  weekday: string
  dayOfWeek: number
  lunar: MoyuDateLunar
}

interface MoyuTodayInfo {
  isWeekend: boolean
  isHoliday: boolean
  isWorkday: boolean
  holidayName: string | null
  solarTerm: string | null
  lunarFestivals: string[]
}

interface MoyuProgressItem {
  passed: number
  total: number
  remaining: number
  percentage: number
}

interface MoyuProgressInfo {
  week: MoyuProgressItem
  month: MoyuProgressItem
  year: MoyuProgressItem
}

interface MoyuHolidayInfo {
  name: string
  date: string
  until: number
  duration: number
  workdays: string[]
}

interface MoyuWeekendInfo {
  date: string
  weekday: string
  daysUntil: number
}

interface MoyuCountdownInfo {
  toWeekEnd: number
  toFriday: number
  toMonthEnd: number
  toYearEnd: number
}

interface MoyuData {
  date: MoyuDateInfo
  today: MoyuTodayInfo
  progress: MoyuProgressInfo
  currentHoliday: MoyuHolidayInfo | null
  nextHoliday: MoyuHolidayInfo
  nextWeekend: MoyuWeekendInfo
  countdown: MoyuCountdownInfo
  moyuQuote: string
}

interface MoyuResponse {
  code: number
  message: string
  data: MoyuData
}

interface GoldMetalItem {
  name: string
  sell_price: string
  today_price: string
  high_price: string
  low_price: string
  unit: string
  updated: string
  updated_at: number
}

interface GoldStoreItem {
  brand: string
  product: string
  price: string
  unit: string
  formatted: string
  updated: string
  updated_at: number
}

interface GoldBankItem {
  bank: string
  product: string
  price: string
  unit: string
  formatted: string
  time: string
  updated: string
  updated_at: number
}

interface GoldRecycleItem {
  type: string
  price: string
  unit: string
  formatted: string
  purity: string
  updated: string
  updated_at: number
}

interface GoldData {
  date: string
  metals: GoldMetalItem[]
  stores: GoldStoreItem[]
  banks: GoldBankItem[]
  recycle: GoldRecycleItem[]
}

interface GoldResponse {
  code: number
  message: string
  data: GoldData
}

interface FuelItem {
  name: string
  price: number
  price_desc: string
}

interface FuelData {
  region: string
  items: FuelItem[]
  link: string
  updated: string
  updated_at: number
}

interface FuelResponse {
  code: number
  message: string
  data: FuelData
}


export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('aka-60s-api')
  const normalizedApiBaseUrl = (config.apiBaseUrl || 'http://172.0.0.1:4399').replace(/\/$/, '')
  const buildApiUrl = (path: string) => `${normalizedApiBaseUrl}${path}`
  const cooldowns: Map<string, number> = new Map()
  let scheduleTimeout: NodeJS.Timeout | null = null
  let aiNewsScheduleTimeout: NodeJS.Timeout | null = null
  let moyuScheduleTimeout: NodeJS.Timeout | null = null
  let goldScheduleTimeout: NodeJS.Timeout | null = null
  let fuelScheduleTimeout: NodeJS.Timeout | null = null

  async function resolveGroupScheduleChannels(whitelist: string[], tag: string): Promise<string[]> {
    try {
      if (!whitelist.length) {
        logInfo('60s API: 未配置定时发送白名单', { tag })
        return []
      }

      // 白名单兼容：
      // - 支持 platform:channelId（推荐）
      // - 兼容仅填写 channelId（例如 onebot 群号）
      // - 兼容常见尾缀（例如 onebot:123456@group）
      const normalize = (raw: string) => {
        const value = String(raw || '').trim()
        const withoutAt = value.includes('@') ? value.split('@')[0] : value
        const [platform, id] = withoutAt.includes(':') ? withoutAt.split(':', 2) : ['', withoutAt]
        return {
          raw: value,
          withoutAt,
          platform,
          id,
        }
      }

      const whitelistNormalized = whitelist.map(normalize).filter((item) => item.withoutAt)
      const whitelistKeys = new Set<string>()
      whitelistNormalized.forEach((item) => {
        whitelistKeys.add(item.raw)
        whitelistKeys.add(item.withoutAt)
        if (item.id) whitelistKeys.add(item.id)
      })

      const assigned = await ctx.database.getAssignedChannels(['id', 'platform', 'guildId'])
      logInfo('60s API: 获取到的频道列表', {
        tag,
        count: assigned.length,
        channels: assigned.map((c) => ({ platform: c.platform, id: c.id, guildId: c.guildId })),
      })

      const groupChannels = assigned
        .filter((channel) => !!channel.guildId)
        .map((channel) => ({
          platform: channel.platform,
          id: channel.id,
          key: `${channel.platform}:${channel.id}`,
        }))

      if (!groupChannels.length) {
        logInfo('60s API: 没有可发送的群组频道', { tag })
        return []
      }

      logInfo('60s API: 群组频道列表', { tag, channels: groupChannels.map((c) => c.key) })
      logInfo('60s API: 白名单配置(原始)', { tag, whitelist })
      logInfo('60s API: 白名单配置(规范化)', {
        tag,
        whitelist: whitelistNormalized.map((w) => ({ raw: w.raw, withoutAt: w.withoutAt, id: w.id })),
      })

      const targets = groupChannels
        .filter((c) => whitelistKeys.has(c.key) || whitelistKeys.has(c.id))
        .map((c) => c.key)

      if (!targets.length) {
        logInfo('60s API: 白名单未命中任何已加入群组频道', {
          tag,
          groupChannels: groupChannels.map((c) => c.key),
          whitelist,
        })
      } else {
        logInfo('60s API: 白名单匹配成功', { tag, targets })
      }

      return targets
    } catch (error) {
      logError('60s API: 获取群组频道失败', { tag, error })
      return []
    }
  }

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
      
      const response = await ctx.http.get(buildApiUrl('/v2/60s'), {
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
      
      const response = await ctx.http.get(buildApiUrl('/v2/today-in-history'), {
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
      
      const response = await ctx.http.get(buildApiUrl('/v2/zhihu'), {
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

  // 获取AI快报
  async function getAiNews(params: { date?: string; all?: string; encoding?: string }): Promise<AiNewsResponse | string> {
    try {
      logInfo('60s API: 开始获取AI快报', params)

      const response = await ctx.http.get(buildApiUrl('/v2/ai-news'), {
        params: {
          date: params.date,
          all: params.all,
          encoding: params.encoding || 'text'
        },
        timeout: 30000
      }) as AiNewsResponse | string

      logInfo('60s API: 获取AI快报成功')

      return response
    } catch (error) {
      logError('60s API: 获取AI快报失败', error)
      throw error
    }
  }

  async function getMoyuDaily(encoding: string = 'text'): Promise<MoyuResponse | string> {
    try {
      logInfo('60s API: 开始获取摸鱼日报', { encoding })

      const response = await ctx.http.get(buildApiUrl('/v2/moyu'), {
        params: {
          encoding
        },
        timeout: 30000
      }) as MoyuResponse | string

      logInfo('60s API: 获取摸鱼日报成功')

      return response
    } catch (error) {
      logError('60s API: 获取摸鱼日报失败', error)
      throw error
    }
  }

  async function getGoldPrice(encoding: string = 'text'): Promise<GoldResponse | string> {
    try {
      logInfo('60s API: 开始获取今日金价', { encoding })

      const response = await ctx.http.get(buildApiUrl('/v2/gold-price'), {
        params: {
          encoding
        },
        timeout: 30000
      }) as GoldResponse | string

      logInfo('60s API: 获取今日金价成功')

      return response
    } catch (error) {
      logError('60s API: 获取今日金价失败', error)
      throw error
    }
  }

  async function getFuelPrice(params: { region?: string; encoding?: string }): Promise<FuelResponse | string> {
    try {
      logInfo('60s API: 开始获取今日油价', params)

      const response = await ctx.http.get(buildApiUrl('/v2/fuel-price'), {
        params: {
          region: params.region,
          encoding: params.encoding || 'text'
        },
        timeout: 30000
      }) as FuelResponse | string

      logInfo('60s API: 获取今日油价成功')

      return response
    } catch (error) {
      logError('60s API: 获取今日油价失败', error)
      throw error
    }
  }

  // 发送新闻到指定频道
  async function sendNewsToChannels() {
    const targetChannels = await resolveGroupScheduleChannels(config.scheduleWhitelist, 'news')
    if (targetChannels.length === 0) {
      logInfo('60s API: 没有目标频道，跳过新闻发送')
      return
    }

    try {
      const imageBuffer = await get60sNewsImage()
      const imageMessage = h.image(imageBuffer, 'image/png')
      
      for (const channelId of targetChannels) {
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

  function formatAiNewsText(data: AiNewsData | AiNewsData[]): string {
    const items = normalizeAiNewsData(data).flatMap((item) => item.news)
    return items.map((newsItem, index) => `${index + 1}. ${newsItem.title}\n${newsItem.link}`).join('\n\n')
  }

  function formatAiNewsMarkdown(data: AiNewsData | AiNewsData[]): string {
    const items = normalizeAiNewsData(data).flatMap((item) => item.news)
    return items.map((newsItem) => `- [${newsItem.title}](${newsItem.link})`).join('\n')
  }

  function toTitleLinkData(data: AiNewsData | AiNewsData[]): AiNewsData[] {
    return normalizeAiNewsData(data).map((item) => ({
      date: item.date,
      news: item.news.map((newsItem) => ({
        title: newsItem.title,
        detail: '',
        link: newsItem.link,
        source: '',
        date: newsItem.date,
      })),
    }))
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function normalizeAiNewsData(data: AiNewsData | AiNewsData[]): AiNewsData[] {
    return Array.isArray(data) ? data : [data]
  }

  function getRecentAiNewsDates(): string[] {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    return [formatDate(now), formatDate(yesterday)]
  }

  async function fetchAiNewsByDates(dates: string[]): Promise<AiNewsData[]> {
    const responses = await Promise.all(
      dates.map((date) => getAiNews({ date, encoding: 'json' }) as Promise<AiNewsResponse>)
    )
    const items: AiNewsData[] = []

    responses.forEach((response, index) => {
      if (response.code !== 200 || !response.data) {
        logError('60s API: AI快报返回错误', { code: response.code, message: response.message, date: dates[index] })
        return
      }
      items.push(...normalizeAiNewsData(response.data))
    })

    return items.sort((a, b) => b.date.localeCompare(a.date))
  }

  async function sendAiNewsToChannels() {
    const targetChannels = await resolveGroupScheduleChannels(config.scheduleWhitelist, 'ai-news')
    if (targetChannels.length === 0) {
      logInfo('60s API: 没有目标频道，跳过AI快报发送')
      return
    }

    try {
      const response = await getAiNews({ encoding: 'json' }) as AiNewsResponse
      if (response.code !== 200 || !response.data) {
        logError('60s API: AI快报返回错误', { code: response.code, message: response.message })
        return
      }

      const message = formatAiNewsText(response.data)

      for (const channelId of targetChannels) {
        try {
          const output = config.aiUseForward ? h('figure', {}, [message]) : message
          await ctx.broadcast([channelId], output)
          logInfo('60s API: 定时发送AI快报成功', { channelId })
        } catch (error) {
          logError('60s API: 定时发送AI快报到频道失败', { channelId, error })
        }
      }
    } catch (error) {
      logError('60s API: 定时发送AI快报失败', error)
    }
  }

  function formatMoyuText(data: MoyuData): string {
    const lunar = `${data.date.lunar.yearCN}年${data.date.lunar.monthCN}${data.date.lunar.dayCN}`
    const festival = data.today.lunarFestivals.length ? `节日：${data.today.lunarFestivals.join('、')}` : '节日：无'
    const holidayName = data.today.holidayName ? `假期：${data.today.holidayName}` : '假期：无'
    const solarTerm = data.today.solarTerm ? `节气：${data.today.solarTerm}` : '节气：无'

    const lines = [
      `🍱 摸鱼日报 ${data.date.gregorian} ${data.date.weekday}`,
      `农历：${lunar}`,
      `${holidayName} | ${solarTerm} | ${festival}`,
      `进度：周 ${data.progress.week.percentage}% / 月 ${data.progress.month.percentage}% / 年 ${data.progress.year.percentage}%`,
      `倒计时：周末 ${data.countdown.toWeekEnd} 天 | 周五 ${data.countdown.toFriday} 天 | 月末 ${data.countdown.toMonthEnd} 天 | 年末 ${data.countdown.toYearEnd} 天`,
      `下个周末：${data.nextWeekend.date}（${data.nextWeekend.weekday}）还剩 ${data.nextWeekend.daysUntil} 天`,
      `下个假期：${data.nextHoliday.name} ${data.nextHoliday.date}（${data.nextHoliday.until} 天后）`,
      `摸鱼语录：${data.moyuQuote}`
    ]

    return lines.join('\n')
  }

  async function sendMoyuToChannels() {
    const targetChannels = await resolveGroupScheduleChannels(config.scheduleWhitelist, 'moyu')
    if (targetChannels.length === 0) {
      logInfo('60s API: 没有目标频道，跳过摸鱼日报发送')
      return
    }

    try {
      const response = await getMoyuDaily('json') as MoyuResponse
      if (response.code !== 200 || !response.data) {
        logError('60s API: 摸鱼日报返回错误', { code: response.code, message: response.message })
        return
      }

      const message = formatMoyuText(response.data)

      for (const channelId of targetChannels) {
        try {
          await ctx.broadcast([channelId], message)
          logInfo('60s API: 定时发送摸鱼日报成功', { channelId })
        } catch (error) {
          logError('60s API: 定时发送摸鱼日报到频道失败', { channelId, error })
        }
      }
    } catch (error) {
      logError('60s API: 定时发送摸鱼日报失败', error)
    }
  }

  function formatGoldText(data: GoldData): string {
    const metals = data.metals.slice(0, 5).map((item, index) => {
      return `${index + 1}. ${item.name} ${item.today_price}${item.unit} (最高${item.high_price} / 最低${item.low_price})`
    })
    const stores = data.stores.slice(0, 5).map((item, index) => {
      return `${index + 1}. ${item.brand} ${item.product} ${item.formatted}`
    })
    const banks = data.banks.slice(0, 5).map((item, index) => {
      return `${index + 1}. ${item.bank} ${item.product} ${item.formatted}`
    })
    const recycle = data.recycle.slice(0, 5).map((item, index) => {
      return `${index + 1}. ${item.type} ${item.formatted} (${item.purity})`
    })

    return [
      `💰 今日金价 ${data.date}`,
      `-- 金属行情 --`,
      ...metals,
      `-- 金店报价 --`,
      ...stores,
      `-- 银行报价 --`,
      ...banks,
      `-- 回收报价 --`,
      ...recycle
    ].join('\n')
  }

  function formatFuelText(data: FuelData): string {
    const items = data.items.map((item, index) => {
      return `${index + 1}. ${item.name} ${item.price_desc}`
    })

    return [
      `⛽ 今日油价 ${data.region}`,
      ...items,
      `更新时间：${data.updated}`,
      `详情：${data.link}`
    ].join('\n')
  }

  async function sendGoldToChannels() {
    const targetChannels = await resolveGroupScheduleChannels(config.scheduleWhitelist, 'gold')
    if (targetChannels.length === 0) {
      logInfo('60s API: 没有目标频道，跳过金价发送')
      return
    }

    try {
      const response = await getGoldPrice('json') as GoldResponse
      if (response.code !== 200 || !response.data) {
        logError('60s API: 今日金价返回错误', { code: response.code, message: response.message })
        return
      }

      const message = formatGoldText(response.data)

      for (const channelId of targetChannels) {
        try {
          await ctx.broadcast([channelId], message)
          logInfo('60s API: 定时发送今日金价成功', { channelId })
        } catch (error) {
          logError('60s API: 定时发送今日金价到频道失败', { channelId, error })
        }
      }
    } catch (error) {
      logError('60s API: 定时发送今日金价失败', error)
    }
  }

  async function sendFuelToChannels() {
    const targetChannels = await resolveGroupScheduleChannels(config.scheduleWhitelist, 'fuel')
    if (targetChannels.length === 0) {
      logInfo('60s API: 没有目标频道，跳过油价发送')
      return
    }

    try {
      const response = await getFuelPrice({ region: config.fuelDefaultRegion, encoding: 'json' }) as FuelResponse
      if (response.code !== 200 || !response.data) {
        logError('60s API: 今日油价返回错误', { code: response.code, message: response.message })
        return
      }

      const message = formatFuelText(response.data)

      for (const channelId of targetChannels) {
        try {
          await ctx.broadcast([channelId], message)
          logInfo('60s API: 定时发送今日油价成功', { channelId })
        } catch (error) {
          logError('60s API: 定时发送今日油价到频道失败', { channelId, error })
        }
      }
    } catch (error) {
      logError('60s API: 定时发送今日油价失败', error)
    }
  }

  // 计算到下一个指定时间的毫秒数
  function getMsUntilNextTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    
    // 如果今天的时间已过，设置为明天
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }
    
    return target.getTime() - now.getTime()
  }

  // 设置定时任务 - 使用 setTimeout 递归实现精确的每日定时
  function setupSchedule() {
    if (!config.enableSchedule) {
      logInfo('60s API: 定时发送新闻功能已禁用')
      return
    }

    // 清除现有任务
    if (scheduleTimeout) {
      clearTimeout(scheduleTimeout)
      scheduleTimeout = null
    }

    try {
      const msUntilNext = getMsUntilNextTime(config.scheduleTime)
      
      logInfo('60s API: 新闻定时任务已设置', { 
        scheduleTime: config.scheduleTime,
        msUntilNext: msUntilNext,
        nextRun: new Date(Date.now() + msUntilNext).toLocaleString(),
        whitelist: config.scheduleWhitelist
      })

      scheduleTimeout = setTimeout(async () => {
        await sendNewsToChannels()
        // 递归设置下一次执行（24小时后）
        setupSchedule()
      }, msUntilNext)
    } catch (error) {
      logError('60s API: 设置新闻定时任务失败', error)
    }
  }

  function setupAiNewsSchedule() {
    if (!config.enableAiNewsSchedule) {
      logInfo('60s API: AI快报定时发送功能已禁用')
      return
    }

    if (aiNewsScheduleTimeout) {
      clearTimeout(aiNewsScheduleTimeout)
      aiNewsScheduleTimeout = null
    }

    try {
      const msUntilNext = getMsUntilNextTime(config.aiNewsScheduleTime)

      logInfo('60s API: AI快报定时任务已设置', {
        scheduleTime: config.aiNewsScheduleTime,
        msUntilNext: msUntilNext,
        nextRun: new Date(Date.now() + msUntilNext).toLocaleString(),
        whitelist: config.scheduleWhitelist
      })

      aiNewsScheduleTimeout = setTimeout(async () => {
        await sendAiNewsToChannels()
        setupAiNewsSchedule()
      }, msUntilNext)
    } catch (error) {
      logError('60s API: 设置AI快报定时任务失败', error)
    }
  }

  function setupMoyuSchedule() {
    if (!config.enableMoyuSchedule) {
      logInfo('60s API: 摸鱼日报定时发送功能已禁用')
      return
    }

    if (moyuScheduleTimeout) {
      clearTimeout(moyuScheduleTimeout)
      moyuScheduleTimeout = null
    }

    try {
      const msUntilNext = getMsUntilNextTime(config.moyuScheduleTime)

      logInfo('60s API: 摸鱼日报定时任务已设置', {
        scheduleTime: config.moyuScheduleTime,
        msUntilNext: msUntilNext,
        nextRun: new Date(Date.now() + msUntilNext).toLocaleString(),
        whitelist: config.scheduleWhitelist
      })

      moyuScheduleTimeout = setTimeout(async () => {
        await sendMoyuToChannels()
        setupMoyuSchedule()
      }, msUntilNext)
    } catch (error) {
      logError('60s API: 设置摸鱼日报定时任务失败', error)
    }
  }

  function setupGoldSchedule() {
    if (!config.enableGoldSchedule) {
      logInfo('60s API: 今日金价定时发送功能已禁用')
      return
    }

    if (goldScheduleTimeout) {
      clearTimeout(goldScheduleTimeout)
      goldScheduleTimeout = null
    }

    try {
      const msUntilNext = getMsUntilNextTime(config.goldScheduleTime)

      logInfo('60s API: 今日金价定时任务已设置', {
        scheduleTime: config.goldScheduleTime,
        msUntilNext: msUntilNext,
        nextRun: new Date(Date.now() + msUntilNext).toLocaleString(),
        whitelist: config.scheduleWhitelist
      })

      goldScheduleTimeout = setTimeout(async () => {
        await sendGoldToChannels()
        setupGoldSchedule()
      }, msUntilNext)
    } catch (error) {
      logError('60s API: 设置今日金价定时任务失败', error)
    }
  }

  function setupFuelSchedule() {
    if (!config.enableFuelSchedule) {
      logInfo('60s API: 今日油价定时发送功能已禁用')
      return
    }

    if (fuelScheduleTimeout) {
      clearTimeout(fuelScheduleTimeout)
      fuelScheduleTimeout = null
    }

    try {
      const msUntilNext = getMsUntilNextTime(config.fuelScheduleTime)

      logInfo('60s API: 今日油价定时任务已设置', {
        scheduleTime: config.fuelScheduleTime,
        msUntilNext: msUntilNext,
        nextRun: new Date(Date.now() + msUntilNext).toLocaleString(),
        whitelist: config.scheduleWhitelist
      })

      fuelScheduleTimeout = setTimeout(async () => {
        await sendFuelToChannels()
        setupFuelSchedule()
      }, msUntilNext)
    } catch (error) {
      logError('60s API: 设置今日油价定时任务失败', error)
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

  ctx.command('AI快报 [date]', '获取AI资讯快报')
    .option('date', '-d <date> 指定日期 (格式: YYYY-MM-DD)')
    .option('all', '-a 获取所有日期')
    .option('encoding', '-e <encoding> 编码方式 text/json/markdown')
    .action(async (argv, date) => {
      const userId = argv.session.userId

      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }

      try {
        logInfo('60s API: 用户请求AI快报', { userId })

        const encoding = argv.options.encoding || 'text'
        const all = argv.options.all ? '1' : undefined
        const targetDate = argv.options.date || date

        if (!targetDate && !all) {
          const dates = getRecentAiNewsDates()
          const data = await fetchAiNewsByDates(dates)
          if (!data.length) return '未获取到近两天的AI快报数据'
          if (encoding === 'json') {
            await argv.session.send(JSON.stringify(toTitleLinkData(data), null, 2))
            return
          }
          if (encoding === 'markdown') {
            await argv.session.send(formatAiNewsMarkdown(data))
            return
          }
          const message = formatAiNewsText(data)
          if (config.aiUseForward && argv.session.platform === 'onebot') {
            await argv.session.send(h('figure', {}, [message]))
            return
          }
          await argv.session.send(message)
          return
        }

        if (encoding === 'json') {
          const response = await getAiNews({ date: targetDate, all, encoding: 'json' }) as AiNewsResponse
          if (response.code !== 200 || !response.data) {
            logError('60s API: AI快报返回错误', { code: response.code, message: response.message })
            return `获取AI快报失败: ${response.message || '未知错误'}`
          }
          await argv.session.send(JSON.stringify(toTitleLinkData(response.data), null, 2))
          return
        }

        if (encoding === 'markdown') {
          const response = await getAiNews({ date: targetDate, all, encoding: 'json' }) as AiNewsResponse
          if (response.code !== 200 || !response.data) {
            logError('60s API: AI快报返回错误', { code: response.code, message: response.message })
            return `获取AI快报失败: ${response.message || '未知错误'}`
          }
          await argv.session.send(formatAiNewsMarkdown(response.data))
          return
        }

        const response = await getAiNews({ date: targetDate, all, encoding: 'json' }) as AiNewsResponse
        if (response.code !== 200 || !response.data) {
          logError('60s API: AI快报返回错误', { code: response.code, message: response.message })
          return `获取AI快报失败: ${response.message || '未知错误'}`
        }

        const message = formatAiNewsText(response.data)

        if (config.aiUseForward && argv.session.platform === 'onebot') {
          const forwardMessage = h('figure', {}, [message])
          await argv.session.send(forwardMessage)
        } else {
          await argv.session.send(message)
        }

        logInfo('60s API: 成功发送AI快报', {
          userId: userId,
          date: targetDate || 'today',
          all: all || '0'
        })
      } catch (error) {
        logError('60s API: 处理AI快报请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取AI快报失败，请稍后重试'
      }
    })

  ctx.command('摸鱼', '获取摸鱼日报')
    .option('encoding', '-e <encoding> 编码方式 text/json/markdown')
    .action(async (argv) => {
      const userId = argv.session.userId

      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }

      try {
        logInfo('60s API: 用户请求摸鱼日报', { userId })

        const encoding = argv.options.encoding || 'text'

        if (encoding === 'markdown') {
          const response = await getMoyuDaily('markdown') as string
          await argv.session.send(response)
          return
        }

        if (encoding === 'json') {
          const response = await getMoyuDaily('json') as MoyuResponse
          if (response.code !== 200 || !response.data) {
            logError('60s API: 摸鱼日报返回错误', { code: response.code, message: response.message })
            return `获取摸鱼日报失败: ${response.message || '未知错误'}`
          }
          await argv.session.send(JSON.stringify(response.data, null, 2))
          return
        }

        const response = await getMoyuDaily('json') as MoyuResponse
        if (response.code !== 200 || !response.data) {
          logError('60s API: 摸鱼日报返回错误', { code: response.code, message: response.message })
          return `获取摸鱼日报失败: ${response.message || '未知错误'}`
        }

        const message = formatMoyuText(response.data)
        await argv.session.send(message)

        logInfo('60s API: 成功发送摸鱼日报', {
          userId: userId
        })
      } catch (error) {
        logError('60s API: 处理摸鱼日报请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取摸鱼日报失败，请稍后重试'
      }
    })

  ctx.command('金价', '获取今日金价')
    .option('encoding', '-e <encoding> 编码方式 text/json/markdown')
    .action(async (argv) => {
      const userId = argv.session.userId

      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }

      try {
        logInfo('60s API: 用户请求今日金价', { userId })

        const encoding = argv.options.encoding || 'text'

        if (encoding === 'markdown') {
          const response = await getGoldPrice('markdown') as string
          await argv.session.send(response)
          return
        }

        if (encoding === 'json') {
          const response = await getGoldPrice('json') as GoldResponse
          if (response.code !== 200 || !response.data) {
            logError('60s API: 今日金价返回错误', { code: response.code, message: response.message })
            return `获取今日金价失败: ${response.message || '未知错误'}`
          }
          await argv.session.send(JSON.stringify(response.data, null, 2))
          return
        }

        const response = await getGoldPrice('json') as GoldResponse
        if (response.code !== 200 || !response.data) {
          logError('60s API: 今日金价返回错误', { code: response.code, message: response.message })
          return `获取今日金价失败: ${response.message || '未知错误'}`
        }

        const message = formatGoldText(response.data)
        await argv.session.send(message)

        logInfo('60s API: 成功发送今日金价', { userId: userId })
      } catch (error) {
        logError('60s API: 处理今日金价请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取今日金价失败，请稍后重试'
      }
    })

  ctx.command('油价 [region]', '获取今日油价')
    .option('region', '-r <region> 地区')
    .option('encoding', '-e <encoding> 编码方式 text/json/markdown')
    .action(async (argv, region) => {
      const userId = argv.session.userId

      if (!checkCooldown(userId)) {
        const now = Date.now()
        const lastTime = cooldowns.get(userId) || 0
        const timeLeft = Math.ceil((lastTime + config.cooldownTime * 1000 - now) / 1000)
        return `请等待 ${timeLeft} 秒后再试`
      }

      try {
        logInfo('60s API: 用户请求今日油价', { userId })

        const encoding = argv.options.encoding || 'text'
        const targetRegion = argv.options.region || region || config.fuelDefaultRegion

        if (encoding === 'markdown') {
          const response = await getFuelPrice({ region: targetRegion, encoding: 'markdown' }) as string
          await argv.session.send(response)
          return
        }

        if (encoding === 'json') {
          const response = await getFuelPrice({ region: targetRegion, encoding: 'json' }) as FuelResponse
          if (response.code !== 200 || !response.data) {
            logError('60s API: 今日油价返回错误', { code: response.code, message: response.message })
            return `获取今日油价失败: ${response.message || '未知错误'}`
          }
          await argv.session.send(JSON.stringify(response.data, null, 2))
          return
        }

        const response = await getFuelPrice({ region: targetRegion, encoding: 'json' }) as FuelResponse
        if (response.code !== 200 || !response.data) {
          logError('60s API: 今日油价返回错误', { code: response.code, message: response.message })
          return `获取今日油价失败: ${response.message || '未知错误'}`
        }

        const message = formatFuelText(response.data)
        await argv.session.send(message)

        logInfo('60s API: 成功发送今日油价', { userId: userId, region: targetRegion })
      } catch (error) {
        logError('60s API: 处理今日油价请求失败', {
          error: error,
          errorMessage: error?.message || '未知错误',
          userId: userId
        })
        return '获取今日油价失败，请稍后重试'
      }
    })

  // 插件启动时初始化定时任务
  ctx.on('ready', async () => {
    setupSchedule()
    setupAiNewsSchedule()
    setupMoyuSchedule()
    setupGoldSchedule()
    setupFuelSchedule()
  })

  // 插件卸载时清理资源
  ctx.on('dispose', () => {
    cooldowns.clear()
    if (scheduleTimeout) {
      clearTimeout(scheduleTimeout)
      scheduleTimeout = null
    }
    if (aiNewsScheduleTimeout) {
      clearTimeout(aiNewsScheduleTimeout)
      aiNewsScheduleTimeout = null
    }
    if (moyuScheduleTimeout) {
      clearTimeout(moyuScheduleTimeout)
      moyuScheduleTimeout = null
    }
    if (goldScheduleTimeout) {
      clearTimeout(goldScheduleTimeout)
      goldScheduleTimeout = null
    }
    if (fuelScheduleTimeout) {
      clearTimeout(fuelScheduleTimeout)
      fuelScheduleTimeout = null
    }
  })
}
