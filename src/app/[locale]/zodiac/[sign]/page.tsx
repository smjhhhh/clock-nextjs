'use client'

import { useParams } from 'next/navigation'
import { Link } from '@/navigation'

interface ZodiacData {
  name: string
  nameEn: string
  symbol: string
  emoji: string
  decorations: string[]
  element: string
  ruling: string
  dates: string
  color: string
  badge: string
  description: string
  traits: string[]
  strengths: string[]
  weaknesses: string[]
  love: string
  career: string[]
  lucky: {
    number: string
    day: string
    color: string
    stone: string
  }
  compatibility: string[]
  famous: string[]
}

const zodiacData: Record<string, ZodiacData> = {
  'aries': {
    name: '白羊座',
    nameEn: 'Aries',
    symbol: '♈',
    emoji: '🐏',
    decorations: ['🔥', '⚔️', '💪'],
    element: '火象星座',
    ruling: '火星',
    dates: '3月21日 - 4月19日',
    color: 'from-red-500 to-orange-500',
    badge: 'bg-red-100 text-red-700 border-red-300',
    description: '充满活力、勇敢且热情的开拓者，总是勇往直前。',
    traits: [
      '充满活力和热情',
      '勇敢且果断',
      '天生的领导者',
      '喜欢冒险和挑战'
    ],
    strengths: [
      '勇气和自信',
      '充满激情',
      '乐观积极',
      '独立自主'
    ],
    weaknesses: [
      '冲动易怒',
      '缺乏耐心',
      '过于自我',
      '不善于妥协'
    ],
    love: '白羊座在爱情中热情如火，喜欢主动追求。他们直接坦率，需要激情和刺激来维持关系的活力。',
    career: ['企业家', '运动员', '销售经理', '军官', '外科医生', '消防员'],
    lucky: {
      number: '9',
      day: '星期二',
      color: '红色',
      stone: '红宝石'
    },
    compatibility: ['狮子座', '射手座', '双子座', '水瓶座'],
    famous: ['莱昂纳多·达·芬奇', '罗伯特·唐尼', '女神卡卡', '艾玛·沃森']
  },
  'taurus': {
    name: '金牛座',
    nameEn: 'Taurus',
    symbol: '♉',
    emoji: '🐂',
    decorations: ['🌱', '💰', '🏡'],
    element: '土象星座',
    ruling: '金星',
    dates: '4月20日 - 5月20日',
    color: 'from-green-600 to-emerald-600',
    badge: 'bg-green-100 text-green-700 border-green-300',
    description: '稳重、务实且坚定的守护者，追求安全和舒适。',
    traits: [
      '稳重可靠',
      '务实且有耐心',
      '热爱美好事物',
      '坚持不懈'
    ],
    strengths: [
      '忠诚可靠',
      '耐心坚定',
      '实际务实',
      '审美能力强'
    ],
    weaknesses: [
      '固执己见',
      '占有欲强',
      '抵制变化',
      '过于物质化'
    ],
    love: '金牛座在爱情中忠诚且专一，他们重视稳定和安全感。喜欢通过实际行动和礼物表达爱意。',
    career: ['银行家', '厨师', '艺术家', '建筑师', '园艺师', '会计师'],
    lucky: {
      number: '6',
      day: '星期五',
      color: '绿色、粉色',
      stone: '翡翠'
    },
    compatibility: ['处女座', '摩羯座', '巨蟹座', '双鱼座'],
    famous: ['莎士比亚', '奥黛丽·赫本', '大卫·贝克汉姆', '阿黛尔']
  },
  'gemini': {
    name: '双子座',
    nameEn: 'Gemini',
    symbol: '♊',
    emoji: '👯',
    decorations: ['💬', '🎭', '✨'],
    element: '风象星座',
    ruling: '水星',
    dates: '5月21日 - 6月20日',
    color: 'from-yellow-400 to-amber-400',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: '聪明、灵活且善于沟通的社交高手，充满好奇心。',
    traits: [
      '聪明机智',
      '善于沟通',
      '适应力强',
      '好奇心旺盛'
    ],
    strengths: [
      '沟通能力强',
      '思维敏捷',
      '多才多艺',
      '幽默风趣'
    ],
    weaknesses: [
      '缺乏专注',
      '情绪多变',
      '表面化',
      '优柔寡断'
    ],
    love: '双子座在爱情中需要智力刺激和新鲜感。他们善于表达，喜欢通过对话和趣味来维持关系。',
    career: ['记者', '作家', '教师', '翻译', '销售', '公关'],
    lucky: {
      number: '5',
      day: '星期三',
      color: '黄色',
      stone: '玛瑙'
    },
    compatibility: ['天秤座', '水瓶座', '白羊座', '狮子座'],
    famous: ['玛丽莲·梦露', '约翰尼·德普', '安吉丽娜·朱莉', '特朗普']
  },
  'cancer': {
    name: '巨蟹座',
    nameEn: 'Cancer',
    symbol: '♋',
    emoji: '🦀',
    decorations: ['🏠', '💙', '🌙'],
    element: '水象星座',
    ruling: '月亮',
    dates: '6月21日 - 7月22日',
    color: 'from-blue-400 to-cyan-400',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '敏感、体贴且富有同情心的守护者，重视家庭和情感。',
    traits: [
      '情感丰富',
      '富有同情心',
      '保护欲强',
      '直觉敏锐'
    ],
    strengths: [
      '忠诚可靠',
      '富有同理心',
      '直觉准确',
      '善于照顾他人'
    ],
    weaknesses: [
      '过于敏感',
      '情绪化',
      '依赖性强',
      '容易受伤'
    ],
    love: '巨蟹座在爱情中深情且忠诚，他们需要情感安全感。擅长营造温馨的家庭氛围，是体贴的伴侣。',
    career: ['护士', '心理咨询师', '厨师', '教师', '社工', '室内设计师'],
    lucky: {
      number: '2',
      day: '星期一',
      color: '白色、银色',
      stone: '珍珠'
    },
    compatibility: ['天蝎座', '双鱼座', '金牛座', '处女座'],
    famous: ['汤姆·汉克斯', '戴安娜王妃', '埃隆·马斯克', '梅丽尔·斯特里普']
  },
  'leo': {
    name: '狮子座',
    nameEn: 'Leo',
    symbol: '♌',
    emoji: '🦁',
    decorations: ['👑', '☀️', '🎭'],
    element: '火象星座',
    ruling: '太阳',
    dates: '7月23日 - 8月22日',
    color: 'from-orange-500 to-yellow-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '自信、慷慨且充满魅力的王者，天生的领导者。',
    traits: [
      '自信且有魅力',
      '慷慨大方',
      '热情洋溢',
      '天生领导力'
    ],
    strengths: [
      '自信果断',
      '慷慨忠诚',
      '富有创造力',
      '鼓舞人心'
    ],
    weaknesses: [
      '骄傲自大',
      '固执己见',
      '需要关注',
      '过于戏剧化'
    ],
    love: '狮子座在爱情中热情且忠诚，他们喜欢浪漫和被欣赏。慷慨大方，是充满激情的伴侣。',
    career: ['演员', 'CEO', '政治家', '导演', '设计师', '活动策划'],
    lucky: {
      number: '1',
      day: '星期日',
      color: '金色、橙色',
      stone: '黄水晶'
    },
    compatibility: ['白羊座', '射手座', '双子座', '天秤座'],
    famous: ['巴拉克·奥巴马', '詹妮弗·洛佩兹', '拿破仑', '麦当娜']
  },
  'virgo': {
    name: '处女座',
    nameEn: 'Virgo',
    symbol: '♍',
    emoji: '👩',
    decorations: ['📝', '✨', '🔬'],
    element: '土象星座',
    ruling: '水星',
    dates: '8月23日 - 9月22日',
    color: 'from-teal-500 to-green-500',
    badge: 'bg-teal-100 text-teal-700 border-teal-300',
    description: '细心、完美主义且实用的分析家，追求精确和效率。',
    traits: [
      '注重细节',
      '完美主义',
      '分析能力强',
      '勤奋努力'
    ],
    strengths: [
      '细心周到',
      '可靠负责',
      '分析能力强',
      '实用务实'
    ],
    weaknesses: [
      '过于挑剔',
      '焦虑担忧',
      '过度分析',
      '害羞内向'
    ],
    love: '处女座在爱情中忠诚且体贴，他们通过实际行动表达爱意。需要时间建立信任，但一旦承诺就会全心投入。',
    career: ['会计', '编辑', '营养师', '分析师', '研究员', '医生'],
    lucky: {
      number: '5',
      day: '星期三',
      color: '绿色、棕色',
      stone: '蓝宝石'
    },
    compatibility: ['金牛座', '摩羯座', '巨蟹座', '天蝎座'],
    famous: ['碧昂丝', '基努·里维斯', '特蕾莎修女', '沃伦·巴菲特']
  },
  'libra': {
    name: '天秤座',
    nameEn: 'Libra',
    symbol: '♎',
    emoji: '⚖️',
    decorations: ['💕', '🎨', '🌸'],
    element: '风象星座',
    ruling: '金星',
    dates: '9月23日 - 10月22日',
    color: 'from-pink-500 to-rose-500',
    badge: 'bg-pink-100 text-pink-700 border-pink-300',
    description: '优雅、和谐且公正的和平使者，追求平衡和美感。',
    traits: [
      '追求和谐',
      '公正客观',
      '社交能力强',
      '审美能力高'
    ],
    strengths: [
      '外交手腕',
      '公平正义',
      '优雅迷人',
      '善于合作'
    ],
    weaknesses: [
      '优柔寡断',
      '避免冲突',
      '过于依赖他人',
      '表面化'
    ],
    love: '天秤座在爱情中浪漫且体贴，他们重视和谐与平衡。善于营造浪漫氛围，是优雅的伴侣。',
    career: ['律师', '外交官', '设计师', '艺术家', '顾问', '人力资源'],
    lucky: {
      number: '6',
      day: '星期五',
      color: '粉色、蓝色',
      stone: '蛋白石'
    },
    compatibility: ['双子座', '水瓶座', '狮子座', '射手座'],
    famous: ['金·卡戴珊', '威尔·史密斯', '甘地', '奥斯卡·王尔德']
  },
  'scorpio': {
    name: '天蝎座',
    nameEn: 'Scorpio',
    symbol: '♏',
    emoji: '🦂',
    decorations: ['🔮', '💜', '🌙'],
    element: '水象星座',
    ruling: '冥王星',
    dates: '10月23日 - 11月21日',
    color: 'from-purple-600 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '神秘、深邃且强大的变革者，拥有强烈的直觉和意志。',
    traits: [
      '深邃神秘',
      '意志坚定',
      '直觉敏锐',
      '热情强烈'
    ],
    strengths: [
      '意志力强',
      '勇敢坚定',
      '忠诚可靠',
      '洞察力深'
    ],
    weaknesses: [
      '占有欲强',
      '嫉妒心重',
      '报复心强',
      '过于神秘'
    ],
    love: '天蝎座在爱情中深情且专一，他们需要深度的情感连接。占有欲强但极其忠诚，是充满激情的伴侣。',
    career: ['心理学家', '侦探', '外科医生', '研究员', '投资者', '治疗师'],
    lucky: {
      number: '8',
      day: '星期二',
      color: '深红、黑色',
      stone: '黄玉'
    },
    compatibility: ['巨蟹座', '双鱼座', '处女座', '摩羯座'],
    famous: ['莱昂纳多·迪卡普里奥', '比尔·盖茨', '毕加索', '朱莉娅·罗伯茨']
  },
  'sagittarius': {
    name: '射手座',
    nameEn: 'Sagittarius',
    symbol: '♐',
    emoji: '🏹',
    decorations: ['🎯', '🌍', '✈️'],
    element: '火象星座',
    ruling: '木星',
    dates: '11月22日 - 12月21日',
    color: 'from-indigo-500 to-purple-500',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    description: '自由、乐观且爱冒险的探索者，永远追寻真理和意义。',
    traits: [
      '乐观开朗',
      '热爱自由',
      '富有哲学思想',
      '冒险精神'
    ],
    strengths: [
      '乐观积极',
      '诚实直率',
      '富有智慧',
      '热爱学习'
    ],
    weaknesses: [
      '过于直率',
      '缺乏承诺',
      '不负责任',
      '过度承诺'
    ],
    love: '射手座在爱情中自由且热情，他们需要空间和冒险。不喜欢被束缚，寻找能够一起探索世界的伴侣。',
    career: ['旅行家', '教授', '作家', '摄影师', '教练', '企业家'],
    lucky: {
      number: '3',
      day: '星期四',
      color: '紫色',
      stone: '绿松石'
    },
    compatibility: ['白羊座', '狮子座', '天秤座', '水瓶座'],
    famous: ['泰勒·斯威夫特', '布拉德·皮特', '温斯顿·丘吉尔', '简·奥斯汀']
  },
  'capricorn': {
    name: '摩羯座',
    nameEn: 'Capricorn',
    symbol: '♑',
    emoji: '🐐',
    decorations: ['🏔️', '💼', '⏰'],
    element: '土象星座',
    ruling: '土星',
    dates: '12月22日 - 1月19日',
    color: 'from-gray-600 to-slate-600',
    badge: 'bg-gray-100 text-gray-700 border-gray-300',
    description: '雄心勃勃、纪律严明且负责任的攀登者，追求成功和成就。',
    traits: [
      '雄心勃勃',
      '纪律严明',
      '负责任',
      '务实现实'
    ],
    strengths: [
      '坚韧不拔',
      '自律自制',
      '可靠负责',
      '战略眼光'
    ],
    weaknesses: [
      '过于严肃',
      '悲观主义',
      '工作狂',
      '固执死板'
    ],
    love: '摩羯座在爱情中稳重且忠诚，他们认真对待承诺。虽然不善表达，但会用行动证明爱意。',
    career: ['CEO', '工程师', '金融家', '经理', '建筑师', '科学家'],
    lucky: {
      number: '8',
      day: '星期六',
      color: '棕色、黑色',
      stone: '石榴石'
    },
    compatibility: ['金牛座', '处女座', '天蝎座', '双鱼座'],
    famous: ['米歇尔·奥巴马', '马丁·路德·金', '凯特·米德尔顿', '艾萨克·牛顿']
  },
  'aquarius': {
    name: '水瓶座',
    nameEn: 'Aquarius',
    symbol: '♒',
    emoji: '🏺',
    decorations: ['💡', '🌊', '⚡'],
    element: '风象星座',
    ruling: '天王星',
    dates: '1月20日 - 2月18日',
    color: 'from-cyan-500 to-blue-500',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: '创新、独立且人道主义的理想家，追求进步和平等。',
    traits: [
      '创新思维',
      '独立自主',
      '人道主义',
      '思想前卫'
    ],
    strengths: [
      '创造力强',
      '独立思考',
      '人道关怀',
      '开放包容'
    ],
    weaknesses: [
      '情感疏离',
      '固执己见',
      '过于理想化',
      '不可预测'
    ],
    love: '水瓶座在爱情中独立且友善，他们需要智力刺激和自由空间。重视友谊基础，寻找志同道合的伴侣。',
    career: ['科学家', '发明家', '程序员', '人道工作者', '心理学家', '设计师'],
    lucky: {
      number: '4',
      day: '星期六',
      color: '蓝色、银色',
      stone: '紫水晶'
    },
    compatibility: ['双子座', '天秤座', '白羊座', '射手座'],
    famous: ['奥普拉·温弗瑞', '托马斯·爱迪生', '莫扎特', '艾伦·狄珍妮丝']
  },
  'pisces': {
    name: '双鱼座',
    nameEn: 'Pisces',
    symbol: '♓',
    emoji: '🐟',
    decorations: ['🌊', '🎨', '💭'],
    element: '水象星座',
    ruling: '海王星',
    dates: '2月19日 - 3月20日',
    color: 'from-blue-400 to-purple-400',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '富有同情心、直觉敏锐且富有艺术气质的梦想家。',
    traits: [
      '富有同情心',
      '直觉敏锐',
      '艺术天赋',
      '适应力强'
    ],
    strengths: [
      '同理心强',
      '创造力丰富',
      '温柔善良',
      '无私奉献'
    ],
    weaknesses: [
      '过于敏感',
      '逃避现实',
      '容易受影响',
      '优柔寡断'
    ],
    love: '双鱼座在爱情中浪漫且深情，他们全心投入并寻找灵魂伴侣。极其敏感体贴，是温柔的伴侣。',
    career: ['艺术家', '音乐家', '护士', '心理咨询师', '作家', '慈善工作者'],
    lucky: {
      number: '7',
      day: '星期四',
      color: '海绿色',
      stone: '海蓝宝石'
    },
    compatibility: ['巨蟹座', '天蝎座', '金牛座', '摩羯座'],
    famous: ['爱因斯坦', '史蒂夫·乔布斯', '蕾哈娜', '米开朗基罗']
  }
}

export default function ZodiacPage() {
  const params = useParams()
  const sign = (params?.sign as string)?.toLowerCase()
  const data = sign ? zodiacData[sign] : null

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/50">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">未找到该星座</h1>
            <p className="text-gray-600 mb-8">
              请输入有效的星座名称（英文，如 aries, taurus 等）
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Emoji Avatar with Animation */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              {/* Main Avatar Card */}
              <div className={`bg-gradient-to-br ${data.color} p-8 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                <div className="text-9xl filter drop-shadow-lg">
                  {data.emoji}
                </div>
              </div>
              {/* Floating Decorations */}
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
                {data.decorations[0]}
              </div>
              <div className="absolute -bottom-2 -left-4 text-4xl animate-pulse">
                {data.decorations[1]}
              </div>
              <div className="absolute top-0 -left-6 text-3xl animate-bounce delay-100">
                {data.decorations[2]}
              </div>
            </div>
          </div>

          <div className="text-7xl mb-6 opacity-50">{data.symbol}</div>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${data.badge}`}>
              {data.element}
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-2">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              {data.name}
            </span>
          </h1>
          <h2 className="text-2xl text-gray-700 mb-2">{data.nameEn}</h2>
          <p className="text-lg text-gray-600">{data.dates}</p>
        </div>

        {/* Description */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 mb-8">
          <p className="text-xl text-gray-700 text-center italic">
            &quot;{data.description}&quot;
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50 text-center">
            <div className="text-3xl mb-2">🔮</div>
            <div className="text-sm text-gray-600 mb-1">守护星</div>
            <div className="font-bold text-gray-900">{data.ruling}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-sm text-gray-600 mb-1">幸运色</div>
            <div className="font-bold text-gray-900">{data.lucky.color}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50 text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-sm text-gray-600 mb-1">幸运石</div>
            <div className="font-bold text-gray-900">{data.lucky.stone}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50 text-center">
            <div className="text-3xl mb-2">🔢</div>
            <div className="text-sm text-gray-600 mb-1">幸运数字</div>
            <div className="font-bold text-gray-900">{data.lucky.number}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Traits */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                性格特征
              </span>
            </h3>
            <ul className="space-y-3">
              {data.traits.map((trait, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mt-0.5">
                    <span className="text-sm text-purple-600">✓</span>
                  </span>
                  <span className="text-gray-700">{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                优势
              </span>
            </h3>
            <ul className="space-y-3">
              {data.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mt-0.5">
                    <span className="text-sm text-green-600">+</span>
                  </span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                劣势
              </span>
            </h3>
            <ul className="space-y-3">
              {data.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-sm text-orange-600">-</span>
                  </span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                适合职业
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.career.map((job, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Love */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              爱情运势 💕
            </span>
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {data.love}
          </p>
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">最佳配对：</div>
            <div className="flex flex-wrap gap-2">
              {data.compatibility.map((match, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 rounded-full text-sm font-medium border border-pink-200"
                >
                  {match}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Famous People */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              著名人物 ⭐
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.famous.map((person, index) => (
              <span
                key={index}
                className="px-5 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full font-medium border border-purple-200"
              >
                {person}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            返回首页
          </Link>
          <Link
            href="/about-me"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            关于我
          </Link>
        </div>
      </div>
    </div>
  )
}
