'use client'

import { motion, Variants } from 'framer-motion'
import { FiGithub, FiMail, FiMapPin, FiMusic, FiCode, FiHeart, FiUsers, FiTarget, FiMessageCircle, FiSend } from 'react-icons/fi'
import { SiWechat } from 'react-icons/si'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
}

const tags = [
  '巨蟹座', 'INFJ / ENFJ', '56% I 人', '温柔随和',
  '情绪稳定', '全栈萌新', '音乐 & 运动 & 干饭', '倾听搭子',
]

const stats = [
  { label: '12年', desc: '老嵩鼠' },
  { label: '10年', desc: 'JM' },
  { label: '大二', desc: '山西大学' },
  { label: '全栈', desc: '研发实习生' },
]

const hobbies = [
  { icon: FiMusic, title: '音乐本命', items: ['12 年许嵩老粉', '10 年林俊杰粉', '自学笛子中'] },
  { icon: FiHeart, title: '运动充电', items: ['羽毛球业余选手', '日常跑步', '健身新手'] },
  { icon: FiUsers, title: '干饭达人', items: ['干饭天才', '零食收割机', '认真吃喝快乐生活'] },
]

export default function AboutPage() {
  return (
    <div className="relative h-full overflow-y-auto overflow-x-hidden bg-zinc-950 custom-scrollbar">
      {/* Background effects */}
      <div className="pointer-events-none fixed -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-purple-500/5 blur-[150px] z-0" />
      <div className="pointer-events-none fixed -bottom-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-500/5 blur-[150px] z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[900px] mx-auto px-6 md:px-[5vw] py-[8vh] space-y-20"
      >
        {/* ===== Hero ===== */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em]">
            <FiCode className="text-blue-400" /> 郭金波的使用说明 · 可放心食用版
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
              郭金波
            </h1>
            <p className="text-zinc-500 text-lg mt-3 font-light tracking-wide">
              Full-stack Developer · 全栈研发实习生 · 生活体验家
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-mono tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm text-center hover:border-white/10 transition-all">
                <div className="text-2xl font-bold text-white tracking-tight">{s.label}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ===== 关于我 ===== */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiCode /> 关于我
          </h2>
          <div className="p-8 rounded-[32px] bg-zinc-900/30 border border-white/5 backdrop-blur-md space-y-4">
            <p className="text-zinc-400 leading-[1.8] text-[0.95rem]">
              目前作为<strong className="text-zinc-200">全栈研发实习生</strong>开启职场副本，主攻全栈方向开发实践。
              来自<strong className="text-zinc-200">山西大学</strong>（非 211 双一流）的大二学生，起点普通，
              因此更愿意沉下心多学多做、加倍追赶，踏实打磨每一处细节。
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <FiMessageCircle className="text-blue-400 w-5 h-5 shrink-0" />
              <p className="text-blue-300/80 text-sm font-mono tracking-wide">
                代码可以改，情绪不能崩 — 遇事冷静，耐心调试，靠谱交付。
              </p>
            </div>
          </div>
        </motion.section>

        {/* ===== 生活碎片 ===== */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiMusic /> 生活碎片 · 爱好 buff 叠满
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hobbies.map((h) => (
              <div key={h.title} className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all group">
                <h.icon className="text-blue-400 w-5 h-5 mb-4" />
                <h3 className="text-white font-bold text-sm mb-3">{h.title}</h3>
                <ul className="space-y-2">
                  {h.items.map((item) => (
                    <li key={item} className="text-zinc-500 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 backdrop-blur-sm">
            <p className="text-zinc-400 text-sm leading-relaxed">
              我是重度生活体验家 — 杂学知识爱好者，同事专属情感垃圾桶，
              王者荣耀退役辅助位，情绪超级稳定，佛系不内耗。
              目前正在主动打破内向，慢慢往活泼开朗方向转变。
            </p>
          </div>
        </motion.section>

        {/* ===== 性格档案 ===== */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiTarget /> 性格小档案
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'MBTI', value: 'INFJ / ENFJ（56% I 人）' },
              { label: '属性', value: '温柔随和 · 共情力强 · 情绪稳定' },
              { label: '沟通', value: '好沟通 · 有耐心 · 擅长换位思考' },
              { label: '状态', value: '慢热但真诚 · 努力解锁 E 人 buff' },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-zinc-300 text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ===== 目标 ===== */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiTarget /> 现阶段小目标
          </h2>
          <div className="space-y-3">
            {[
              '夯实全栈技术基础，补齐工程化、业务逻辑短板，缩小和大佬们的差距',
              '快速融入团队，多向前辈学习，保持谦逊与冲劲，稳步进阶',
              '保持热爱，平衡工作与生活，做情绪稳定、持续成长的研发人',
            ].map((goal, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/20 border border-white/5 backdrop-blur-sm">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-zinc-400 text-sm leading-relaxed">{goal}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ===== 联系我 ===== */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <FiSend /> 联系我 · 随时唠嗑 &amp; 对接
          </h2>
          <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5 backdrop-blur-md">
            <p className="text-zinc-400 text-sm mb-6">
              全平台名字 &amp; 头像统一，认准 <strong className="text-zinc-200">郭金波</strong> ～
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: FiMail, label: '飞书', desc: '随时在线 · 消息秒回' },
                { icon: SiWechat, label: '微信', desc: 'gjb200618' },
                { icon: FiMapPin, label: '电话', desc: '17735746180' },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
                  <item.icon className="w-5 h-5 text-blue-400/60 group-hover:text-blue-400 transition-colors mb-3" />
                  <div className="text-white text-sm font-bold mb-1">{item.label}</div>
                  <div className="text-zinc-500 text-xs font-mono">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-zinc-600 text-xs font-mono mt-6 text-center tracking-wide">
              工作对接 · 技术交流 · 闲聊吐槽 · 约干饭约运动 · 随时滴滴
            </p>
          </div>
        </motion.section>

        {/* ===== Footer ===== */}
        <motion.footer variants={itemVariants} className="pt-8 text-center border-t border-zinc-900">
          <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-[0.4em] leading-relaxed">
            学历只是起点，努力才是常态<br />
            干饭必须到位，快乐永不掉队
          </p>
          <p className="text-[9px] text-zinc-800 font-mono tracking-[0.3em] mt-4">
            一起好好写代码，快乐搞事业 🚀
          </p>
        </motion.footer>
      </motion.div>
    </div>
  )
}
