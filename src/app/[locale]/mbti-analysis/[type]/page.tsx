'use client'

import { useParams } from 'next/navigation'
import { Link } from '@/navigation'

interface MBTIData {
  type: string
  title: string
  subtitle: string
  group: string
  color: string
  badge: string
  description: string
  traits: string[]
  strengths: string[]
  weaknesses: string[]
  careers: string[]
  relationships: string
  famous: string[]
}

const mbtiData: Record<string, MBTIData> = {
  'INTJ': {
    type: 'INTJ',
    title: '建筑师',
    subtitle: 'The Architect',
    group: '分析师',
    color: 'from-purple-600 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '富有想象力和战略性的思考者，一切皆在计划之中。',
    traits: [
      '独立思考，喜欢深入分析',
      '有强烈的直觉和洞察力',
      '追求完美和效率',
      '善于制定长远计划'
    ],
    strengths: [
      '战略思维能力强',
      '高度独立和自信',
      '善于发现系统性问题',
      '执行力强，能够将想法变为现实'
    ],
    weaknesses: [
      '可能过于自信和固执',
      '对他人情感不够敏感',
      '完美主义可能导致压力',
      '不善于处理日常琐事'
    ],
    careers: [
      '科学家/研究员',
      '软件工程师',
      '战略顾问',
      '建筑师',
      '金融分析师',
      '教授'
    ],
    relationships: 'INTJ 在关系中忠诚且深情，但可能需要时间来表达情感。他们重视智力上的连接，寻找能够理解他们复杂思维的伴侣。',
    famous: ['埃隆·马斯克', '马克·扎克伯格', '克里斯托弗·诺兰', '艾萨克·牛顿']
  },
  'INTP': {
    type: 'INTP',
    title: '逻辑学家',
    subtitle: 'The Logician',
    group: '分析师',
    color: 'from-purple-600 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '具有创新精神的发明家，对知识有着止不住的渴望。',
    traits: [
      '热爱理论和抽象概念',
      '好奇心强，喜欢探索新想法',
      '逻辑思维严密',
      '灵活且适应性强'
    ],
    strengths: [
      '分析能力出众',
      '创造力丰富',
      '开放的思维',
      '客观公正'
    ],
    weaknesses: [
      '可能过于理论化',
      '难以完成项目',
      '社交技能有待提高',
      '对常规事务不耐烦'
    ],
    careers: [
      '哲学家',
      '数学家',
      '程序员',
      '物理学家',
      '作家',
      '心理学家'
    ],
    relationships: 'INTP 在关系中真诚且忠实，虽然可能不擅长表达情感，但会用行动展示关心。他们欣赏能够进行深度对话的伴侣。',
    famous: ['阿尔伯特·爱因斯坦', '比尔·盖茨', '拉里·佩奇', '查尔斯·达尔文']
  },
  'ENTJ': {
    type: 'ENTJ',
    title: '指挥官',
    subtitle: 'The Commander',
    group: '分析师',
    color: 'from-purple-600 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '大胆、有想象力且意志强大的领导者，总能找到或创造解决方法。',
    traits: [
      '天生的领导者',
      '果断且高效',
      '战略眼光长远',
      '自信且有魅力'
    ],
    strengths: [
      '领导力强',
      '高效的决策能力',
      '善于激励他人',
      '目标导向'
    ],
    weaknesses: [
      '可能过于强势',
      '缺乏耐心',
      '对情感需求不敏感',
      '固执己见'
    ],
    careers: [
      '企业家',
      'CEO/高管',
      '律师',
      '投资银行家',
      '政治家',
      '管理顾问'
    ],
    relationships: 'ENTJ 在关系中直接且诚实，他们重视能够挑战自己并共同成长的伴侣。虽然可能显得强势，但他们对承诺非常认真。',
    famous: ['史蒂夫·乔布斯', '玛格丽特·撒切尔', '拿破仑', '富兰克林·罗斯福']
  },
  'ENTP': {
    type: 'ENTP',
    title: '辩论家',
    subtitle: 'The Debater',
    group: '分析师',
    color: 'from-purple-600 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '聪明而好奇的思考者，无法抗拒智力上的挑战。',
    traits: [
      '善于辩论和讨论',
      '思维敏捷灵活',
      '富有创新精神',
      '喜欢挑战传统'
    ],
    strengths: [
      '快速学习能力',
      '善于发现机会',
      '创造性解决问题',
      '出色的沟通技巧'
    ],
    weaknesses: [
      '容易争论过度',
      '难以专注于细节',
      '可能不够敏感',
      '完成度不高'
    ],
    careers: [
      '企业家',
      '营销总监',
      '律师',
      '发明家',
      '记者',
      '演员'
    ],
    relationships: 'ENTP 在关系中充满活力和趣味，他们寻找能够跟上自己思维节奏的伴侣。他们重视智力刺激，享受深度对话。',
    famous: ['托马斯·爱迪生', '马克·吐温', '塞林格', '小罗伯特·唐尼']
  },
  'INFJ': {
    type: 'INFJ',
    title: '提倡者',
    subtitle: 'The Advocate',
    group: '外交家',
    color: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700 border-green-300',
    description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。',
    traits: [
      '富有同理心和洞察力',
      '追求意义和目的',
      '坚持自己的价值观',
      '善于理解他人'
    ],
    strengths: [
      '深刻的洞察力',
      '富有创造力',
      '坚定的价值观',
      '善于激励他人'
    ],
    weaknesses: [
      '过于理想化',
      '容易倦怠',
      '对批评敏感',
      '难以开放自己'
    ],
    careers: [
      '心理咨询师',
      '作家',
      '教师',
      '社会工作者',
      '艺术家',
      '人力资源'
    ],
    relationships: 'INFJ 在关系中深情且忠诚，他们寻找真正的灵魂伴侣。虽然稀少，但一旦找到合适的人，他们会全心投入。',
    famous: ['马丁·路德·金', '纳尔逊·曼德拉', '柏拉图', '村上春树']
  },
  'INFP': {
    type: 'INFP',
    title: '调停者',
    subtitle: 'The Mediator',
    group: '外交家',
    color: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700 border-green-300',
    description: '诗意、善良的利他主义者，总是热切地帮助他人。',
    traits: [
      '理想主义且富有同情心',
      '忠于自己的价值观',
      '富有创造力',
      '适应性强'
    ],
    strengths: [
      '深刻的同理心',
      '创造性思维',
      '开放包容',
      '忠诚可靠'
    ],
    weaknesses: [
      '过于理想化',
      '对批评过于敏感',
      '难以处理冲突',
      '容易忽视细节'
    ],
    careers: [
      '作家/诗人',
      '心理学家',
      '艺术家',
      '教师',
      '社会工作者',
      '图书管理员'
    ],
    relationships: 'INFP 在关系中浪漫且忠诚，他们寻找能够理解自己内心世界的伴侣。他们重视深度连接和情感共鸣。',
    famous: ['威廉·莎士比亚', '约翰·列侬', '弗吉尼亚·伍尔夫', '梵高']
  },
  'ENFJ': {
    type: 'ENFJ',
    title: '主人公',
    subtitle: 'The Protagonist',
    group: '外交家',
    color: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700 border-green-300',
    description: '有魅力鼓舞人心的领导者，能够使听众着迷。',
    traits: [
      '富有魅力和说服力',
      '善于激励和组织',
      '同理心强',
      '关心他人成长'
    ],
    strengths: [
      '出色的沟通能力',
      '天生的领导力',
      '善于理解他人',
      '激励他人的能力'
    ],
    weaknesses: [
      '可能过于理想化',
      '过度关注他人认可',
      '难以做出艰难决定',
      '容易倦怠'
    ],
    careers: [
      '教师/培训师',
      '人力资源经理',
      '公关专家',
      '心理咨询师',
      '政治家',
      '非营利组织负责人'
    ],
    relationships: 'ENFJ 在关系中热情且投入，他们全心全意支持伴侣的成长。他们善于表达情感，重视深度的情感连接。',
    famous: ['奥普拉·温弗瑞', '奥巴马', '教皇方济各', '本·阿弗莱克']
  },
  'ENFP': {
    type: 'ENFP',
    title: '竞选者',
    subtitle: 'The Campaigner',
    group: '外交家',
    color: 'from-green-500 to-emerald-500',
    badge: 'bg-green-100 text-green-700 border-green-300',
    description: '热情、有创造力和社交能力强的自由精神，总能找到理由微笑。',
    traits: [
      '热情洋溢，充满活力',
      '富有创造力和想象力',
      '善于社交',
      '灵活适应'
    ],
    strengths: [
      '优秀的沟通能力',
      '充满热情和活力',
      '善于激发他人潜能',
      '创新思维'
    ],
    weaknesses: [
      '难以专注',
      '过于情绪化',
      '不善于处理细节',
      '容易过度承诺'
    ],
    careers: [
      '作家/记者',
      '心理咨询师',
      '演员',
      '创意总监',
      '营销专家',
      '企业家'
    ],
    relationships: 'ENFP 在关系中充满激情和冒险精神，他们寻找能够分享自己热情的伴侣。他们重视情感连接和共同成长。',
    famous: ['罗宾·威廉姆斯', '威尔·史密斯', '昆汀·塔伦蒂诺', '梅根·福克斯']
  },
  'ISTJ': {
    type: 'ISTJ',
    title: '物流师',
    subtitle: 'The Logistician',
    group: '守卫者',
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '实际和注重事实的个人，可靠性不容怀疑。',
    traits: [
      '可靠且负责任',
      '注重细节和准确性',
      '遵守规则和传统',
      '有条理且有计划'
    ],
    strengths: [
      '高度负责',
      '组织能力强',
      '可靠值得信赖',
      '实事求是'
    ],
    weaknesses: [
      '可能过于保守',
      '不够灵活',
      '难以表达情感',
      '抵制变化'
    ],
    careers: [
      '会计师',
      '审计师',
      '军官',
      '医生',
      '律师',
      '行政管理'
    ],
    relationships: 'ISTJ 在关系中忠诚且可靠，他们通过行动而非言语表达爱意。他们重视稳定和承诺，是值得信赖的伴侣。',
    famous: ['乔治·华盛顿', '沃伦·巴菲特', '安吉拉·默克尔', '娜塔莉·波特曼']
  },
  'ISFJ': {
    type: 'ISFJ',
    title: '守卫者',
    subtitle: 'The Defender',
    group: '守卫者',
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '非常专注而温暖的守护者，时刻准备保护爱着的人们。',
    traits: [
      '细心体贴',
      '忠诚可靠',
      '实际且务实',
      '善于照顾他人'
    ],
    strengths: [
      '可靠且支持性强',
      '细心观察',
      '良好的实用技能',
      '忠诚奉献'
    ],
    weaknesses: [
      '难以拒绝他人',
      '对批评过于敏感',
      '抵制变化',
      '忽视自己的需求'
    ],
    careers: [
      '护士',
      '教师',
      '图书管理员',
      '行政助理',
      '社会工作者',
      '室内设计师'
    ],
    relationships: 'ISFJ 在关系中温暖且体贴，他们全心投入照顾伴侣的需求。他们重视稳定和传统，是极其忠诚的伴侣。',
    famous: ['特蕾莎修女', '凯特·米德尔顿', '比昂斯', '安妮·海瑟薇']
  },
  'ESTJ': {
    type: 'ESTJ',
    title: '总经理',
    subtitle: 'The Executive',
    group: '守卫者',
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '出色的管理者，在管理事情或人的时候无与伦比。',
    traits: [
      '高效组织能力',
      '果断且直接',
      '传统且有原则',
      '善于管理和领导'
    ],
    strengths: [
      '出色的组织能力',
      '高效决策',
      '可靠负责',
      '善于实施计划'
    ],
    weaknesses: [
      '可能过于死板',
      '不够灵活',
      '对情感不够敏感',
      '难以接受批评'
    ],
    careers: [
      '企业高管',
      '军官',
      '法官',
      '银行经理',
      '警察',
      '项目经理'
    ],
    relationships: 'ESTJ 在关系中忠诚且可靠，他们重视传统和稳定。虽然可能显得强势，但他们深深关心家人和伴侣。',
    famous: ['希拉里·克林顿', '亨利·福特', '林登·约翰逊', '西蒙·考威尔']
  },
  'ESFJ': {
    type: 'ESFJ',
    title: '执政官',
    subtitle: 'The Consul',
    group: '守卫者',
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '极有同情心、受欢迎且和睦的合作者，总是热切地帮助他人。',
    traits: [
      '热情友好',
      '善于照顾他人',
      '重视和谐',
      '负责任且有条理'
    ],
    strengths: [
      '出色的人际技能',
      '组织能力强',
      '忠诚可靠',
      '善于营造和谐氛围'
    ],
    weaknesses: [
      '过于在意他人看法',
      '难以接受批评',
      '抵制变化',
      '可能忽视自己需求'
    ],
    careers: [
      '护士',
      '教师',
      '活动策划',
      '公关专家',
      '销售代表',
      '人力资源'
    ],
    relationships: 'ESFJ 在关系中温暖且投入，他们非常重视家庭和伴侣。他们善于表达关心，是体贴周到的伴侣。',
    famous: ['泰勒·斯威夫特', '比尔·克林顿', '珍妮弗·加纳', '史蒂夫·哈维']
  },
  'ISTP': {
    type: 'ISTP',
    title: '鉴赏家',
    subtitle: 'The Virtuoso',
    group: '探险家',
    color: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '大胆而实际的实验者，擅长使用各类工具。',
    traits: [
      '动手能力强',
      '冷静且理性',
      '适应性强',
      '喜欢探索和尝试'
    ],
    strengths: [
      '解决问题能力强',
      '冷静应对危机',
      '实用技能出色',
      '灵活适应'
    ],
    weaknesses: [
      '难以表达情感',
      '可能显得冷漠',
      '不善于长期规划',
      '容易冒险'
    ],
    careers: [
      '机械师',
      '工程师',
      '飞行员',
      '警察',
      '运动员',
      '摄影师'
    ],
    relationships: 'ISTP 在关系中独立且低调，他们通过行动而非言语表达爱意。他们需要个人空间，但对伴侣忠诚。',
    famous: ['克林特·伊斯特伍德', '汤姆·克鲁斯', '布鲁斯·李', '迈克尔·乔丹']
  },
  'ISFP': {
    type: 'ISFP',
    title: '探险家',
    subtitle: 'The Adventurer',
    group: '探险家',
    color: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '灵活有魅力的艺术家，时刻准备着探索和体验新事物。',
    traits: [
      '富有艺术气质',
      '温和且敏感',
      '活在当下',
      '适应性强'
    ],
    strengths: [
      '艺术才能',
      '同理心强',
      '灵活开放',
      '善于观察'
    ],
    weaknesses: [
      '过于敏感',
      '难以规划未来',
      '避免冲突',
      '可能过于独立'
    ],
    careers: [
      '艺术家',
      '音乐家',
      '设计师',
      '厨师',
      '摄影师',
      '兽医'
    ],
    relationships: 'ISFP 在关系中温柔且浪漫，他们通过行动和创意表达爱意。他们重视和谐，避免冲突，是体贴的伴侣。',
    famous: ['迈克尔·杰克逊', '莫扎特', '弗里达·卡罗', '奥黛丽·赫本']
  },
  'ESTP': {
    type: 'ESTP',
    title: '企业家',
    subtitle: 'The Entrepreneur',
    group: '探险家',
    color: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '聪明、精力充沛且善于感知的人，真心享受生活在边缘。',
    traits: [
      '精力充沛',
      '善于冒险',
      '实际且务实',
      '善于社交'
    ],
    strengths: [
      '适应能力强',
      '善于抓住机会',
      '直接坦率',
      '解决问题能力强'
    ],
    weaknesses: [
      '冲动行事',
      '不善于长期规划',
      '可能显得不敏感',
      '容易厌倦'
    ],
    careers: [
      '企业家',
      '销售人员',
      '营销经理',
      '运动员',
      '急救人员',
      '活动策划'
    ],
    relationships: 'ESTP 在关系中充满活力和趣味，他们享受与伴侣的冒险和新体验。他们直接坦率，是充满激情的伴侣。',
    famous: ['唐纳德·特朗普', '欧内斯特·海明威', '麦当娜', '布鲁斯·威利斯']
  },
  'ESFP': {
    type: 'ESFP',
    title: '表演者',
    subtitle: 'The Entertainer',
    group: '探险家',
    color: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-300',
    description: '自发的、精力充沛和热情的表演者——生活在他们周围永远不会无聊。',
    traits: [
      '充满活力和热情',
      '善于娱乐他人',
      '活在当下',
      '友好外向'
    ],
    strengths: [
      '出色的人际技能',
      '乐观积极',
      '实用务实',
      '善于鼓舞他人'
    ],
    weaknesses: [
      '容易分心',
      '避免冲突',
      '难以专注长期目标',
      '过于敏感'
    ],
    careers: [
      '演员',
      '音乐家',
      '活动策划',
      '导游',
      '销售人员',
      '摄影师'
    ],
    relationships: 'ESFP 在关系中充满活力和浪漫，他们享受与伴侣分享快乐时光。他们慷慨大方，是充满趣味的伴侣。',
    famous: ['玛丽莲·梦露', '埃尔顿·约翰', '杰米·奥利弗', '米拉·库尼斯']
  }
}

export default function MBTIAnalysisPage() {
  const params = useParams()
  const type = (params?.type as string)?.toUpperCase()
  const data = type ? mbtiData[type] : null

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/50">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">未找到该类型</h1>
            <p className="text-gray-600 mb-8">
              请输入有效的 MBTI 类型（如 INTJ, ENFP 等）
            </p>
            <Link
              href="/mbti-test"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              开始测试
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${data.badge}`}>
              {data.group}
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              {data.type}
            </span>
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h2>
          <p className="text-xl text-gray-600">{data.subtitle}</p>
        </div>

        {/* Description */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 mb-8">
          <p className="text-xl text-gray-700 text-center italic">
            &quot;{data.description}&quot;
          </p>
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
              {data.careers.map((career, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Relationships */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              人际关系
            </span>
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {data.relationships}
          </p>
        </div>

        {/* Famous People */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className={`bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
              著名人物
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
            href="/mbti-test"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            重新测试
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
