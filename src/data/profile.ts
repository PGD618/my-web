import { FiMail, FiMapPin, FiMusic, FiHeart, FiUsers } from 'react-icons/fi'
import { SiWechat } from 'react-icons/si'

// 粉龄基准：2026 年为 12 年许嵩老粉 / 10 年林俊杰粉，之后每年 +1
const FAN_YEARS_BASE_YEAR = 2026
const currentYear = new Date().getFullYear()
const fanYearsOffset = Math.max(0, currentYear - FAN_YEARS_BASE_YEAR)
const xuSongYears = 12 + fanYearsOffset
const linJunjieYears = 10 + fanYearsOffset

export const tags = [
  '巨蟹座', '日常 INFJ / 工作 INTJ', '56% I 人', '温柔随和',
  '情绪稳定', '全栈萌新', '音乐 & 运动 & 干饭', '倾听搭子',
]

export const stats = [
  { label: `${xuSongYears}年`, desc: '老嵩鼠' },
  { label: `${linJunjieYears}年`, desc: 'JM' },
  { label: '大三', desc: '山西大学' },
  { label: '全栈', desc: '研发实习生' },
]

export const hobbies = [
  { icon: FiMusic, title: '音乐本命', items: [`${xuSongYears} 年许嵩老粉`, `${linJunjieYears} 年林俊杰粉`, '自学笛子中'] },
  { icon: FiHeart, title: '运动充电', items: ['羽毛球业余选手', '日常跑步', '健身新手'] },
  { icon: FiUsers, title: '干饭达人', items: ['干饭天才', '零食收割机', '认真吃喝快乐生活'] },
]

export const personality = [
  { label: 'MBTI', value: '日常 INFJ · 工作 INTJ' },
  { label: '属性', value: '温柔随和 · 共情力强 · 情绪稳定' },
  { label: '沟通', value: '好沟通 · 有耐心 · 擅长换位思考' },
  { label: '状态', value: '慢热但真诚 · 努力解锁 E 人 buff' },
]

export const goals = [
  '夯实全栈技术基础，补齐工程化、业务逻辑短板，缩小和大佬们的差距',
  '快速融入团队，多向前辈学习，保持谦逊与冲劲，稳步进阶',
  '保持热爱，平衡工作与生活，做情绪稳定、持续成长的研发人',
]

export const contacts = [
  { icon: FiMail, label: '飞书', desc: '随时在线 · 消息秒回' },
  { icon: SiWechat, label: '微信', desc: 'gjb200618' },
  { icon: FiMapPin, label: '电话', desc: '17735746180' },
]
